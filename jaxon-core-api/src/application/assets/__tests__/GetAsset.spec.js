import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetAsset } from '../GetAsset.js';
import { NotFoundException } from '../../../domain/core/exceptions.js';
import { AssetStatus } from '../../../domain/assets/Asset.js';
describe('GetAsset Use Case', () => {
    let assetRepository;
    let getAsset;
    beforeEach(() => {
        assetRepository = {
            save: vi.fn(),
            findById: vi.fn(),
            findAll: vi.fn(),
            findByStatus: vi.fn(),
            findByAssignee: vi.fn(),
            findIntegrityHash: vi.fn(),
        };
        getAsset = new GetAsset(assetRepository);
    });
    describe('execute', () => {
        it('should return an asset if it exists', async () => {
            const mockAsset = {
                props: {
                    id: 'asset-123',
                    description: 'MacBook Pro',
                    status: AssetStatus.ACTIVE,
                },
                toPrimitives: vi.fn().mockReturnValue({ id: 'asset-123', description: 'MacBook Pro' }),
            };
            assetRepository.findById = vi.fn().mockResolvedValue(mockAsset);
            const result = await getAsset.execute('asset-123');
            expect(result.props.id).toBe('asset-123');
            expect(assetRepository.findById).toHaveBeenCalledWith('asset-123');
            expect(assetRepository.findById).toHaveBeenCalledTimes(1);
        });
        it('should throw NotFoundException if asset does not exist', async () => {
            assetRepository.findById = vi.fn().mockResolvedValue(null);
            await expect(getAsset.execute('non-existent')).rejects.toThrow(NotFoundException);
        });
        it('should pass exact id to repository', async () => {
            assetRepository.findById = vi.fn().mockResolvedValue(null);
            try {
                await getAsset.execute('exact-id-123');
            }
            catch (e) {
                // Expected to throw
            }
            expect(assetRepository.findById).toHaveBeenCalledWith('exact-id-123');
        });
        it('should handle empty string id', async () => {
            assetRepository.findById = vi.fn().mockResolvedValue(null);
            await expect(getAsset.execute('')).rejects.toThrow();
        });
        it('should throw error if repository fails', async () => {
            assetRepository.findById = vi.fn().mockRejectedValue(new Error('DB Connection Error'));
            await expect(getAsset.execute('asset-123')).rejects.toThrow('DB Connection Error');
        });
        it('should return asset with all properties intact', async () => {
            const mockAsset = {
                props: {
                    id: 'asset-123',
                    description: 'Test Asset',
                    category: 'PC',
                    status: AssetStatus.MAINTENANCE,
                    assignedTo: 'user-456',
                    createdBy: 'user-1',
                    updatedBy: 'user-2',
                    createdAt: new Date('2026-01-01'),
                    updatedAt: new Date('2026-03-29'),
                },
                toPrimitives: vi.fn().mockReturnValue({ id: 'asset-123' }),
            };
            assetRepository.findById = vi.fn().mockResolvedValue(mockAsset);
            const result = await getAsset.execute('asset-123');
            expect(result.props.description).toBe('Test Asset');
            expect(result.props.category).toBe('PC');
            expect(result.props.status).toBe(AssetStatus.MAINTENANCE);
            expect(result.props.assignedTo).toBe('user-456');
        });
    });
});
//# sourceMappingURL=GetAsset.spec.js.map