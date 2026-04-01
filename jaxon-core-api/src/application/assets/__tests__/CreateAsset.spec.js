import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAsset } from '../CreateAsset.js';
import { AssetStatus } from '../../../domain/assets/Asset.js';
describe('CreateAsset Use Case', () => {
    let assetRepository;
    let createAsset;
    let auditLogger;
    beforeEach(() => {
        assetRepository = {
            save: vi.fn().mockResolvedValue(undefined),
            findById: vi.fn(),
            findAll: vi.fn(),
            findByStatus: vi.fn(),
            findByAssignee: vi.fn(),
            findIntegrityHash: vi.fn(),
        };
        auditLogger = { logAction: vi.fn().mockResolvedValue(undefined) };
        createAsset = new CreateAsset(assetRepository, auditLogger);
    });
    describe('execute', () => {
        it('should successfully create a new asset with default ACTIVE status', async () => {
            const request = {
                description: 'Test Server',
                category: 'Hardware',
                actorId: 'user-uuid',
            };
            const asset = await createAsset.execute(request);
            expect(asset.props.id).toBeDefined();
            expect(asset.props.description).toBe('Test Server');
            expect(asset.props.category).toBe('Hardware');
            expect(asset.props.status).toBe(AssetStatus.ACTIVE);
            expect(asset.props.createdBy).toBe('user-uuid');
            expect(asset.props.updatedBy).toBe('user-uuid');
            expect(assetRepository.save).toHaveBeenCalledTimes(1);
            expect(auditLogger.logAction).toHaveBeenCalledTimes(1);
        });
        it('should create an asset with custom status when provided', async () => {
            const request = {
                description: 'Legacy Printer',
                category: 'Hardware',
                status: AssetStatus.RETIRED,
                actorId: 'user-uuid',
            };
            const asset = await createAsset.execute(request);
            expect(asset.props.status).toBe(AssetStatus.RETIRED);
        });
        it('should generate unique ID for each asset', async () => {
            const request1 = {
                description: 'Asset 1',
                category: 'Hardware',
                actorId: 'user-1',
            };
            const request2 = {
                description: 'Asset 2',
                category: 'Hardware',
                actorId: 'user-1',
            };
            const asset1 = await createAsset.execute(request1);
            const asset2 = await createAsset.execute(request2);
            expect(asset1.props.id).not.toBe(asset2.props.id);
        });
        it('should throw error if repository save fails', async () => {
            assetRepository.save = vi.fn().mockRejectedValue(new Error('Database error'));
            const request = {
                description: 'Test',
                category: 'Hardware',
                actorId: 'user-1',
            };
            await expect(createAsset.execute(request)).rejects.toThrow('Database error');
        });
        it('should assign correct timestamps to created asset', async () => {
            const before = new Date();
            const request = {
                description: 'Test',
                category: 'Hardware',
                actorId: 'user-1',
            };
            const asset = await createAsset.execute(request);
            const after = new Date();
            expect(asset.props.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(asset.props.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
            expect(asset.props.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(asset.props.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });
        it('should initialize asset with null assignedTo', async () => {
            const request = {
                description: 'Test',
                category: 'Hardware',
                actorId: 'user-1',
            };
            const asset = await createAsset.execute(request);
            expect(asset.props.assignedTo).toBeNull();
        });
        it('should call repository save with created asset instance', async () => {
            const request = {
                description: 'Test',
                category: 'Hardware',
                actorId: 'user-1',
            };
            await createAsset.execute(request);
            expect(assetRepository.save).toHaveBeenCalled();
            const savedAsset = assetRepository.save.mock.calls[0][0];
            expect(savedAsset.props.description).toBe('Test');
            expect(savedAsset.props.category).toBe('Hardware');
        });
    });
});
//# sourceMappingURL=CreateAsset.spec.js.map