import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListAssets } from '../ListAssets.js';
import { AssetStatus } from '../../../domain/assets/Asset.js';
import type { AssetRepository } from '../../../domain/assets/AssetRepository.js';

describe('ListAssets Use Case', () => {
  let assetRepository: AssetRepository;
  let listAssets: ListAssets;

  beforeEach(() => {
    assetRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByStatus: vi.fn(),
      findByAssignee: vi.fn(),
      findIntegrityHash: vi.fn(),
    } as any;
    listAssets = new ListAssets(assetRepository);
  });

  describe('execute', () => {
    it('should return empty array when no assets exist', async () => {
      assetRepository.findAll = vi.fn().mockResolvedValue([]);

      const assets = await listAssets.execute();

      expect(Array.isArray(assets)).toBe(true);
      expect(assets.length).toBe(0);
    });

    it('should return all assets from repository', async () => {
      const mockAssets = [
        {
          props: {
            id: 'asset-1',
            description: 'Asset 1',
            status: AssetStatus.ACTIVE,
          },
          toPrimitives: vi.fn().mockReturnValue({ id: 'asset-1', description: 'Asset 1' }),
        },
        {
          props: {
            id: 'asset-2',
            description: 'Asset 2',
            status: AssetStatus.MAINTENANCE,
          },
          toPrimitives: vi.fn().mockReturnValue({ id: 'asset-2', description: 'Asset 2' }),
        },
      ];

      assetRepository.findAll = vi.fn().mockResolvedValue(mockAssets);

      const assets = await listAssets.execute();

      expect(assets.length).toBe(2);
      expect(assetRepository.findAll).toHaveBeenCalledTimes(1);
      expect(assets[0].props.id).toBe('asset-1');
      expect(assets[1].props.id).toBe('asset-2');
    });

    it('should maintain order returned from repository', async () => {
      const mockAssets = [
        { props: { id: 'asset-1' }, toPrimitives: vi.fn() },
        { props: { id: 'asset-3' }, toPrimitives: vi.fn() },
        { props: { id: 'asset-2' }, toPrimitives: vi.fn() },
      ];

      assetRepository.findAll = vi.fn().mockResolvedValue(mockAssets);

      const assets = await listAssets.execute();

      expect(assets[0].props.id).toBe('asset-1');
      expect(assets[1].props.id).toBe('asset-3');
      expect(assets[2].props.id).toBe('asset-2');
    });

    it('should throw error if repository fails', async () => {
      assetRepository.findAll = vi.fn().mockRejectedValue(new Error('DB Connection Error'));

      await expect(listAssets.execute()).rejects.toThrow('DB Connection Error');
    });

    it('should handle large datasets', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        props: { id: `asset-${i}` },
        toPrimitives: vi.fn(),
      }));

      assetRepository.findAll = vi.fn().mockResolvedValue(largeDataset);

      const assets = await listAssets.execute();

      expect(assets.length).toBe(1000);
      expect(assets[0].props.id).toBe('asset-0');
      expect(assets[999].props.id).toBe('asset-999');
    });
  });
});
