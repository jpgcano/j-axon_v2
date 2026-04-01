import { NotFoundException } from '../../domain/core/exceptions.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class UnassignAsset {
    assetRepository;
    auditLogger;
    constructor(assetRepository, auditLogger) {
        this.assetRepository = assetRepository;
        this.auditLogger = auditLogger;
    }
    async execute(request) {
        const asset = await this.assetRepository.findById(request.id);
        if (!asset) {
            throw new NotFoundException('Asset', request.id);
        }
        const payloadBefore = asset.toPrimitives();
        asset.unassign(request.actorId);
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
//# sourceMappingURL=UnassignAsset.js.map