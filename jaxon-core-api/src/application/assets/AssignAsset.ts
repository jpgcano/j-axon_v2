import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface AssignAssetRequest {
  id: string;
  assigneeId: string;
  actorId: string;
}

export class AssignAsset {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: AssignAssetRequest) {
    const asset = await this.assetRepository.findById(request.id);
    if (!asset) {
      throw new NotFoundException('Asset', request.id);
    }

    const payloadBefore = asset.toPrimitives();

    asset.assignTo(request.assigneeId, request.actorId);

    await this.assetRepository.save(asset);

    const payloadAfter = asset.toPrimitives();
    await this.auditLogger.logAction({
      entityTable: 'jaxon_assets',
      entityId: request.id,
      actionType: AuditActionType.UPDATE,
      payloadBefore,
      payloadAfter,
      actorId: request.actorId,
      ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
    });

    return asset;
  }
}
