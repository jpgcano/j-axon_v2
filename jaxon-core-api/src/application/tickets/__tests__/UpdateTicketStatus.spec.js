import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTicketStatus } from '../UpdateTicketStatus.js';
import { TicketStatus, RiskLevel } from '../../../domain/tickets/Ticket.js';
describe('UpdateTicketStatus', () => {
    let ticketRepository;
    let wsService;
    let updateTicketStatus;
    beforeEach(() => {
        ticketRepository = {
            findById: vi.fn(),
            save: vi.fn().mockResolvedValue(undefined)
        };
        wsService = { emitEvent: vi.fn() };
        const auditService = { recordAction: vi.fn() };
        updateTicketStatus = new UpdateTicketStatus(ticketRepository, wsService, auditService);
    });
    it('should prevent TECH from resolving EXTREME tickets', async () => {
        const ticketMock = {
            toPrimitives: () => ({ id: '123', inherentRiskLevel: RiskLevel.EXTREME, status: TicketStatus.OPEN }),
        };
        ticketRepository.findById.mockResolvedValue(ticketMock);
        await expect(updateTicketStatus.execute({
            id: '123',
            status: TicketStatus.RESOLVED,
            actorId: 'tech-id',
            actorRole: 'TECH'
        })).rejects.toThrow('Insufficient privileges to resolve EXTREME risk tickets');
    });
    it('should allow resolving if role is ADMIN', async () => {
        const ticketMock = {
            toPrimitives: () => ({ id: '123', inherentRiskLevel: RiskLevel.EXTREME, status: TicketStatus.OPEN }),
        };
        ticketRepository.findById.mockResolvedValue(ticketMock);
        await updateTicketStatus.execute({
            id: '123',
            status: TicketStatus.RESOLVED,
            actorId: 'admin-id',
            actorRole: 'ADMIN'
        });
        expect(ticketRepository.save).toHaveBeenCalled();
        const savedAsset = ticketRepository.save.mock.calls[0][0];
        expect(savedAsset.toPrimitives().status).toBe(TicketStatus.RESOLVED);
        expect(wsService.emitEvent).toHaveBeenCalled();
    });
});
//# sourceMappingURL=UpdateTicketStatus.spec.js.map