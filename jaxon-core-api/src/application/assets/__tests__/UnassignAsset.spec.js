import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnassignAsset } from '../UnassignAsset.js';
import { Asset, AssetStatus } from '../../../domain/assets/Asset.js';
import { NotFoundException } from '../../../domain/core/exceptions.js';
describe('UnassignAsset', () => {
    const assetRepository = {
        findById: vi.fn(),
        save: vi.fn(),
        findIntegrityHash: vi.fn(),
    };
    const auditLogger = {
        logAction: vi.fn(),
    };
    let useCase;
    beforeEach(() => {
        vi.clearAllMocks();
        useCase = new UnassignAsset(assetRepository, auditLogger);
    });
    it('should unassign asset and audit', async () => {
        const asset = new Asset({
            id: 'asset-1',
            description: 'Test',
            category: 'HW',
            status: AssetStatus.ACTIVE,
            assignedTo: 'user-2',
            createdBy: 'user-1',
            updatedBy: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        assetRepository.findById.mockResolvedValue(asset);
        await useCase.execute({ id: 'asset-1', actorId: 'user-1' });
        expect(assetRepository.save).toHaveBeenCalled();
        expect(auditLogger.logAction).toHaveBeenCalled();
    });
    it('should throw if asset not found', async () => {
        assetRepository.findById.mockResolvedValue(null);
        await expect(useCase.execute({ id: 'missing', actorId: 'user-1' })).rejects.toBeInstanceOf(NotFoundException);
    });
});
//# sourceMappingURL=UnassignAsset.spec.js.map