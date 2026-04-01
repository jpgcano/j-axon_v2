import type { Request, Response, NextFunction } from 'express';
import type { CreateAsset } from '../../application/assets/CreateAsset.js';
import type { ListAssets } from '../../application/assets/ListAssets.js';
import type { GetAsset } from '../../application/assets/GetAsset.js';
import type { UpdateAsset } from '../../application/assets/UpdateAsset.js';
import type { AssignAsset } from '../../application/assets/AssignAsset.js';
import type { UpdateAssetStatus } from '../../application/assets/UpdateAssetStatus.js';
import type { UnassignAsset } from '../../application/assets/UnassignAsset.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
export declare class AssetController {
    private readonly createAsset;
    private readonly listAssets;
    private readonly getAsset;
    private readonly updateAsset;
    private readonly assignAsset;
    private readonly updateAssetStatus;
    private readonly unassignAsset;
    constructor(createAsset: CreateAsset, listAssets: ListAssets, getAsset: GetAsset, updateAsset: UpdateAsset, assignAsset: AssignAsset, updateAssetStatus: UpdateAssetStatus, unassignAsset: UnassignAsset);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    assign: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    unassign: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AssetController.d.ts.map