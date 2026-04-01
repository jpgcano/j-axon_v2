import { Request, Response } from 'express';
import { AnullationAssetService } from '../../AnullationAssetService.js';
/**
 * Controlador para la gestión de ciclo de vida de Activos
 * Cumple con la Regla de Negocio 01 (Prohibición de borrado físico)
 */
export declare class AssetActionsController {
    private anullationAssetService;
    constructor(anullationAssetService: AnullationAssetService);
    voidAsset(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=assetActionsController.d.ts.map