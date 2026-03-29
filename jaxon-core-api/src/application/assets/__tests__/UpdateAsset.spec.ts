import { describe, it, expect, vi } from 'vitest';
import { UpdateAsset } from '../UpdateAsset.js';
import { AssetStatus } from '../../../domain/assets/Asset.js';

describe('UpdateAsset', () => {
  const mockAssetRepository = {
    findById: vi.fn(),
    save: vi.fn(),
  };

  const updateAsset = new UpdateAsset(mockAssetRepository);

  it('should update an existing asset', async () => {
    const existingAsset = {
      props: {
        id: 'asset-1',
        description: 'Old description',
        category: 'PC',
        status: AssetStatus.ACTIVE,
        assignedTo: null,
        createdBy: 'user-1',
        updatedBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      toPrimitives: vi.fn().mockReturnValue({}),
    };

    mockAssetRepository.findById.mockResolvedValue(existingAsset);
    mockAssetRepository.save.mockResolvedValue(existingAsset);

    const request = {
      id: 'asset-1',
      description: 'New description',
      actorId: 'user-2',
    };

    const result = await updateAsset.execute(request);

    expect(mockAssetRepository.findById).toHaveBeenCalledWith('asset-1');
    expect(mockAssetRepository.save).toHaveBeenCalled();
    expect(result.props.description).toBe('New description');
    expect(result.props.updatedBy).toBe('user-2');
  });

  it('should throw error if asset not found', async () => {
    mockAssetRepository.findById.mockResolvedValue(null);

    const request = {
      id: 'non-existent',
      description: 'Test',
      actorId: 'user-1',
    };

    await expect(updateAsset.execute(request)).rejects.toThrow('Asset not found');
  });
});