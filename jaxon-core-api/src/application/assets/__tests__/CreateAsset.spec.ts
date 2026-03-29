import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAsset } from '../CreateAsset.js';
import { AssetStatus } from '../../../domain/assets/Asset.js';
import type { AssetRepository } from '../../../domain/assets/AssetRepository.js';

describe('CreateAsset', () => {
  let assetRepository: AssetRepository;
  let createAsset: CreateAsset;
  let auditService: any;

  beforeEach(() => {
    assetRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByStatus: vi.fn(),
      findByAssignee: vi.fn(),
    } as any;
    auditService = { recordAction: vi.fn() } as any;
    createAsset = new CreateAsset(assetRepository, auditService);
  });

  it('should successfully create a new asset', async () => {
    const request = {
      description: 'Test Server',
      category: 'Hardware',
      actorId: 'user-uuid',
    };

    const asset = await createAsset.execute(request);

    expect(asset.id).toBeDefined();
    expect(asset.toPrimitives().description).toBe(request.description);
    expect(asset.toPrimitives().status).toBe(AssetStatus.ACTIVE);
    expect(assetRepository.save).toHaveBeenCalled();
  });

  it('should create an asset with custom status', async () => {
    const request = {
      description: 'Legacy Printer',
      category: 'Hardware',
      status: AssetStatus.RETIRED,
      actorId: 'user-uuid',
    };

    const asset = await createAsset.execute(request);

    expect(asset.toPrimitives().status).toBe(AssetStatus.RETIRED);
  });
});
