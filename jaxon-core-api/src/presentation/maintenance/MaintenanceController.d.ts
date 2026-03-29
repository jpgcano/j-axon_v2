import type { Request, Response, NextFunction } from 'express';
import type { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import type { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import type { GetMaintenance } from '../../application/maintenance/GetMaintenance.js';
import type { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
export declare class MaintenanceController {
    private readonly createMaintenance;
    private readonly listMaintenance;
    private readonly getMaintenance;
    private readonly updateMaintenanceStatus;
    constructor(createMaintenance: CreateMaintenance, listMaintenance: ListMaintenance, getMaintenance: GetMaintenance, updateMaintenanceStatus: UpdateMaintenanceStatus);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=MaintenanceController.d.ts.map