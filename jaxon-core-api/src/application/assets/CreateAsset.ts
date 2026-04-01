import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetProps } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import { randomUUID } from 'crypto';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface CreateAssetRequest {
  description: string;
  category: string;
  status?: AssetStatus;
  actorId: string;
}

export class CreateAsset {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: CreateAssetRequest): Promise<Asset> {
    const assetId = randomUUID();
    const now = new Date();

    const props: AssetProps = {
      id: assetId,
      description: request.description,
      category: request.category,
      status: request.status || AssetStatus.ACTIVE,
      assignedTo: null,
      createdBy: request.actorId,
      updatedBy: request.actorId,
      createdAt: now,
      updatedAt: now,
    };

    const asset = new Asset(props);
    await this.assetRepository.save(asset);

    await this.auditLogger.logAction({
      entityTable: 'jaxon_assets',
      entityId: assetId,
      actionType: AuditActionType.CREATE,
      payloadBefore: null,
      payloadAfter: asset.toPrimitives(),
      actorId: request.actorId,
      ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
    });

    return asset;
  }
}
