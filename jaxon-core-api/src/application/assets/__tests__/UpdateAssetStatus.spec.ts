import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateAssetStatus } from '../UpdateAssetStatus.js';
import { Asset, AssetStatus } from '../../../domain/assets/Asset.js';
import { ConflictException, NotFoundException } from '../../../domain/core/exceptions.js';

describe('UpdateAssetStatus', () => {
  const mockAssetRepository = {
    findById: vi.fn(),
    save: vi.fn(),
    findIntegrityHash: vi.fn(),
  } as any;

  const mockAuditLogger = {
    logAction: vi.fn(),
  } as any;

  let useCase: UpdateAssetStatus;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateAssetStatus(mockAssetRepository, mockAuditLogger);
  });

  it('should update status when integrity hash matches', async () => {
    const asset = new Asset({
      id: 'asset-1',
      description: 'Test',
      category: 'HW',
      status: AssetStatus.ACTIVE,
      assignedTo: null,
      createdBy: 'user-1',
      updatedBy: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockAssetRepository.findById.mockResolvedValue(asset);
    mockAssetRepository.findIntegrityHash
      .mockResolvedValueOnce('hash-old')
      .mockResolvedValueOnce('hash-new');

    await useCase.execute({
      id: 'asset-1',
      status: AssetStatus.MAINTENANCE,
      currentIntegrityHash: 'hash-old',
      actorId: 'user-2',
    });

    expect(mockAssetRepository.save).toHaveBeenCalled();
    expect(mockAuditLogger.logAction).toHaveBeenCalled();
  });

  it('should throw if asset not found', async () => {
    mockAssetRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        id: 'asset-404',
        status: AssetStatus.RETIRED,
        currentIntegrityHash: 'hash',
        actorId: 'user-1',
      })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw conflict if integrity hash mismatches', async () => {
    const asset = new Asset({
      id: 'asset-1',
      description: 'Test',
      category: 'HW',
      status: AssetStatus.ACTIVE,
      assignedTo: null,
      createdBy: 'user-1',
      updatedBy: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockAssetRepository.findById.mockResolvedValue(asset);
    mockAssetRepository.findIntegrityHash.mockResolvedValue('hash-db');

    await expect(
      useCase.execute({
        id: 'asset-1',
        status: AssetStatus.MAINTENANCE,
        currentIntegrityHash: 'hash-client',
        actorId: 'user-1',
      })
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
