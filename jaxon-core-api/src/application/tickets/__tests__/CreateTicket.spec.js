/**
 * CreateTicket Use Case Tests
 *
 * Test suite validating:
 * - Ticket creation with ERM calculation
 * - Asset validation (must exist)
 * - Auto-approval for LOW/MEDIUM
 * - Blocking for HIGH/EXTREME (PENDING_APPROVAL)
 * - Audit log registration
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateTicket } from '../CreateTicket.js';
import { TicketRepository } from '../../../infrastructure/ports/TicketRepository.js';
import { AssetRepository } from '../../../infrastructure/ports/AssetRepository.js';
import { AuditLogger } from '../../audit/AuditLogger.js';
import { v4 as uuid } from 'uuid';
describe('CreateTicket Use Case', () => {
    let createTicket;
    let ticketRepository;
    let assetRepository;
    let auditLogger;
    let assetId;
    let userId;
    beforeEach(() => {
        assetId = uuid();
        userId = uuid();
        // Mock repositories
        ticketRepository = {
            save: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn(),
            findByAssetId: vi.fn(),
            findByStatus: vi.fn(),
            findPendingApprovals: vi.fn(),
            findAll: vi.fn(),
            findByAssignedTech: vi.fn(),
            count: vi.fn(),
            delete: vi.fn(),
        };
        assetRepository = {
            save: vi.fn(),
            findById: vi.fn().mockResolvedValue({ id: assetId }), // Asset exists
            findAll: vi.fn(),
            findByAssignedUser: vi.fn(),
        };
        auditLogger = {
            logAction: vi.fn().mockResolvedValue(undefined),
        };
        createTicket = new CreateTicket(ticketRepository, assetRepository, auditLogger);
    });
    describe('Successful ticket creation', () => {
        it('should create LOW risk ticket (P=1, C=1) with AUTO approval', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Minor maintenance needed',
                probability: 1,
                consequence: 1,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('LOW');
            expect(result.status).toBe('APPROVED');
            expect(result.requiresApproval).toBe(false);
            expect(result.message).toContain('Automatically approved');
        });
        it('should create MEDIUM risk ticket (P=2, C=4) with AUTO approval', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Moderate issue',
                probability: 2,
                consequence: 4,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('MEDIUM');
            expect(result.status).toBe('APPROVED');
            expect(result.requiresApproval).toBe(false);
        });
        it('should create HIGH risk ticket (P=4, C=5) BLOCKING with PENDING_APPROVAL', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Critical system failure',
                probability: 4,
                consequence: 5,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('HIGH');
            expect(result.status).toBe('PENDING_APPROVAL');
            expect(result.requiresApproval).toBe(true);
            expect(result.message).toContain('Requires manager approval');
        });
        it('should create EXTREME risk ticket (P=5, C=5) BLOCKING', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Total system breakdown',
                probability: 5,
                consequence: 5,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('EXTREME');
            expect(result.status).toBe('PENDING_APPROVAL');
            expect(result.requiresApproval).toBe(true);
        });
        it('should save ticket to repository', async () => {
            await createTicket.execute({
                assetId,
                description: 'Test ticket',
                probability: 2,
                consequence: 2,
                createdBy: userId,
            });
            expect(ticketRepository.save).toHaveBeenCalled();
            const savedTicket = ticketRepository.save.mock.calls[0][0];
            expect(savedTicket.getAssetId()).toBe(assetId);
        });
        it('should register creation in audit logs', async () => {
            await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 2,
                consequence: 2,
                createdBy: userId,
            });
            expect(auditLogger.logAction).toHaveBeenCalled();
            const logCall = auditLogger.logAction.mock.calls[0][0];
            expect(logCall.actionType).toBe('CREATE');
            expect(logCall.entityTable).toBe('jaxon_tickets');
        });
        it('should return ticket ID in response', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 3,
                consequence: 3,
                createdBy: userId,
            });
            expect(result.id).toBeDefined();
            expect(result.id).toMatch(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i);
        });
        it('should include createdAt timestamp in response', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 2,
                consequence: 3,
                createdBy: userId,
            });
            expect(result.createdAt).toBeInstanceOf(Date);
        });
    });
    describe('Validation errors', () => {
        it('should throw error if asset does not exist', async () => {
            assetRepository.findById.mockResolvedValueOnce(null);
            await expect(createTicket.execute({
                assetId: uuid(),
                description: 'Test',
                probability: 2,
                consequence: 2,
                createdBy: userId,
            })).rejects.toThrow('Asset with ID');
        });
        it('should throw error if probability is invalid', async () => {
            await expect(createTicket.execute({
                assetId,
                description: 'Test',
                probability: 6, // Out of range
                consequence: 2,
                createdBy: userId,
            })).rejects.toThrow('Probability must be between 1-5');
        });
        it('should throw error if consequence is invalid', async () => {
            await expect(createTicket.execute({
                assetId,
                description: 'Test',
                probability: 2,
                consequence: 0, // Out of range
                createdBy: userId,
            })).rejects.toThrow('Consequence must be between 1-5');
        });
        it('should throw error if description is empty', async () => {
            await expect(createTicket.execute({
                assetId,
                description: '', // Empty
                probability: 2,
                consequence: 2,
                createdBy: userId,
            })).rejects.toThrow('Description cannot be empty');
        });
    });
    describe('ERM corner cases', () => {
        it('should calculate boundary LOW/MEDIUM: P=3, C=4 = 12 (boundary)', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 3,
                consequence: 4,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('MEDIUM');
            expect(result.requiresApproval).toBe(false);
        });
        it('should calculate boundary MEDIUM/HIGH: P=3, C=5 = 15', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 3,
                consequence: 5,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('HIGH');
            expect(result.requiresApproval).toBe(true);
        });
        it('should calculate boundary HIGH/EXTREME: P=5, C=4 = 20', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 5,
                consequence: 4,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('HIGH');
            expect(result.requiresApproval).toBe(true);
        });
        it('should calculate EXTREME: P=5, C=5 = 25', async () => {
            const result = await createTicket.execute({
                assetId,
                description: 'Test',
                probability: 5,
                consequence: 5,
                createdBy: userId,
            });
            expect(result.riskLevel).toBe('EXTREME');
            expect(result.requiresApproval).toBe(true);
        });
    });
});
//# sourceMappingURL=CreateTicket.spec.js.map