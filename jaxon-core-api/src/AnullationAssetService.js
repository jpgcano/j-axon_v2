export class AnullationAssetService {
    assetRepository;
    auditLogger;
    constructor(assetRepository, auditLogger) {
        this.assetRepository = assetRepository;
        this.auditLogger = auditLogger;
    }
    async voidAsset(assetId, reason, actorId, ip) {
        const asset = await this.assetRepository.findById(assetId);
        if (!asset)
            throw new Error('ASSET_NOT_FOUND');
        const payloadBefore = { ...asset };
        // Regla 01: No eliminar, solo cambiar estado a VOIDED
        const updatedAsset = await this.assetRepository.update(assetId, {
            status: 'VOIDED',
            metadata: { ...asset.metadata, void_reason: reason, voided_at: new Date().toISOString() }
        });
        await this.auditLogger.logAction({
            entityTable: 'jaxon_assets',
            entityId: assetId,
            actionType: 'VOID_BY_ERROR',
            actorId,
            ipOrigin: ip,
            payloadBefore,
            payloadAfter: updatedAsset
        });
    }
}
//# sourceMappingURL=AnullationAssetService.js.map