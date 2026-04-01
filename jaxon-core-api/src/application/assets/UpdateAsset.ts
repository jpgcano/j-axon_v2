import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface UpdateAssetRequest {
  id: string;
  description?: string;
  category?: string;
  status?: AssetStatus;
  actorId: string;
}

export class UpdateAsset {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: UpdateAssetRequest): Promise<Asset> {
    const existingAsset = await this.assetRepository.findById(request.id);
    if (!existingAsset) {
      throw new Error('Asset not found');
    }

    const payloadBefore = existingAsset.toPrimitives();

    const updatedAsset = new Asset({
      ...existingAsset.props,
      description: request.description ?? existingAsset.props.description,
      category: request.category ?? existingAsset.props.category,
      status: request.status ?? existingAsset.props.status,
      updatedBy: request.actorId,
      updatedAt: new Date(),
    });

    await this.assetRepository.save(updatedAsset);

    await this.auditLogger.logAction({
      entityTable: 'jaxon_assets',
      entityId: request.id,
      actionType: AuditActionType.UPDATE,
      payloadBefore,
      payloadAfter: updatedAsset.toPrimitives(),
      actorId: request.actorId,
      ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
    });

    return updatedAsset;
  }
}
