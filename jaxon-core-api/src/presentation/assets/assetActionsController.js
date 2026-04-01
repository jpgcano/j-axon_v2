import { Request, Response } from 'express';
import { AnullationAssetService } from '../../AnullationAssetService.js';
/**
 * Controlador para la gestión de ciclo de vida de Activos
 * Cumple con la Regla de Negocio 01 (Prohibición de borrado físico)
 */
export class AssetActionsController {
    anullationAssetService;
    constructor(anullationAssetService) {
        this.anullationAssetService = anullationAssetService;
    }
    async voidAsset(req, res) {
        const { id } = req.params;
        const { reason } = req.body;
        const actorId = req.user?.id || 'ADMIN-USER-001';
        const ip = req.ip || '127.0.0.1';
        try {
            await this.anullationAssetService.voidAsset(id, reason, actorId, ip);
            return res.status(200).json({
                success: true,
                message: 'Activo anulado correctamente (Estado: VOIDED).'
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
//# sourceMappingURL=assetActionsController.js.map