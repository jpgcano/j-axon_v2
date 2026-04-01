import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class UpdateAsset {
    assetRepository;
    auditLogger;
    constructor(assetRepository, auditLogger) {
        this.assetRepository = assetRepository;
        this.auditLogger = auditLogger;
    }
    async execute(request) {
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
//# sourceMappingURL=UpdateAsset.js.map