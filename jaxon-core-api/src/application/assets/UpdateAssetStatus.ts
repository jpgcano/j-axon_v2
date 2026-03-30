import { AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import { NotFoundException, ConflictException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface UpdateAssetStatusRequest {
  id: string;
  status: AssetStatus;
  currentIntegrityHash: string;
  reason?: string;
  actorId: string;
}

export class UpdateAssetStatus {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: UpdateAssetStatusRequest) {
    const asset = await this.assetRepository.findById(request.id);
    if (!asset) {
      throw new NotFoundException('Asset', request.id);
    }

    const storedHash = await this.assetRepository.findIntegrityHash(request.id);
    if (!storedHash) {
      throw new NotFoundException('Asset', request.id);
    }

    if (storedHash !== request.currentIntegrityHash) {
      throw new ConflictException('Integrity hash mismatch');
    }

    const payloadBefore = { ...asset.toPrimitives(), integrityHash: storedHash };

    asset.changeStatus(request.status, request.actorId);
    await this.assetRepository.save(asset);

    const newHash = await this.assetRepository.findIntegrityHash(request.id);
    const payloadAfter = { ...asset.toPrimitives(), integrityHash: newHash };

    await this.auditLogger.logAction({
      entityTable: 'jaxon_assets',
      entityId: request.id,
      actionType: AuditActionType.STATUS_CHANGED,
      payloadBefore,
      payloadAfter,
      actorId: request.actorId,
      ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
    });

    return asset;
  }
}
