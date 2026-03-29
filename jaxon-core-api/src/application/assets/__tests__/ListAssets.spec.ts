import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListAssets } from '../ListAssets.js';

describe('ListAssets', () => {
  it('should return all assets from repository', async () => {
    const assetsMock = [{ toPrimitives: () => ({ id: '1' }) }];
    const assetRepository = { findAll: vi.fn().mockResolvedValue(assetsMock) } as any;
    const listAssets = new ListAssets(assetRepository);

    const result = await listAssets.execute();

    expect(result).toHaveLength(1);
    expect(assetRepository.findAll).toHaveBeenCalled();
  });
});
