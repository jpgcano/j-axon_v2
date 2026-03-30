import type { Request, Response, NextFunction } from 'express';
import type { CreateAsset } from '../../application/assets/CreateAsset.js';
import type { ListAssets } from '../../application/assets/ListAssets.js';
import type { GetAsset } from '../../application/assets/GetAsset.js';
import type { UpdateAsset } from '../../application/assets/UpdateAsset.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
export declare class AssetController {
    private readonly createAsset;
    private readonly listAssets;
    private readonly getAsset;
    private readonly updateAsset;
    constructor(createAsset: CreateAsset, listAssets: ListAssets, getAsset: GetAsset, updateAsset: UpdateAsset);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AssetController.d.ts.map