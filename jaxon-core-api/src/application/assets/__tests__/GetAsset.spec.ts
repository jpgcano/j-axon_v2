import { describe, it, expect, vi } from 'vitest';
import { GetAsset } from '../GetAsset.js';
import { NotFoundException } from '../../../domain/core/exceptions.js';

describe('GetAsset', () => {
  it('should return an asset if it exists', async () => {
    const assetMock = { toPrimitives: () => ({ id: '1' }) };
    const assetRepository = { findById: vi.fn().mockResolvedValue(assetMock) } as any;
    const getAsset = new GetAsset(assetRepository);

    const result = await getAsset.execute('1');

    expect(result.toPrimitives().id).toBe('1');
  });

  it('should throw NotFoundException if asset does not exist', async () => {
    const assetRepository = { findById: vi.fn().mockResolvedValue(null) } as any;
    const getAsset = new GetAsset(assetRepository);

    await expect(getAsset.execute('999')).rejects.toThrow(NotFoundException);
  });
});
