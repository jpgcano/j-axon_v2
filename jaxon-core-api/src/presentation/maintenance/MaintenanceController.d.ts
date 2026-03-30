import type { Request, Response } from 'express';
import { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';
export declare class MaintenanceController {
    private readonly createMaintenance;
    private readonly listMaintenance;
    private readonly updateMaintenanceStatus;
    constructor(createMaintenance: CreateMaintenance, listMaintenance: ListMaintenance, updateMaintenanceStatus: UpdateMaintenanceStatus);
    create(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=MaintenanceController.d.ts.map