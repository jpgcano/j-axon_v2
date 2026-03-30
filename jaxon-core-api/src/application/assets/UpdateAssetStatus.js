import { AssetStatus } from '../../domain/assets/Asset.js';
import { NotFoundException, ConflictException } from '../../domain/core/exceptions.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class UpdateAssetStatus {
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
//# sourceMappingURL=UpdateAssetStatus.js.map