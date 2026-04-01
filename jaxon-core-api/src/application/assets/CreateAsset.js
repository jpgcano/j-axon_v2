import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import { randomUUID } from 'crypto';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class CreateAsset {
    assetRepository;
    auditLogger;
    constructor(assetRepository, auditLogger) {
        this.assetRepository = assetRepository;
        this.auditLogger = auditLogger;
    }
    async execute(request) {
        const assetId = randomUUID();
        const now = new Date();
        const props = {
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
//# sourceMappingURL=CreateAsset.js.map