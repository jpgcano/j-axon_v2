import { Maintenance, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
export interface CreateMaintenanceRequest {
    assetId: string;
    ticketId?: string;
    type: MaintenanceType;
    description: string;
    scheduledDate: Date;
    actorId: string;
}
export declare class CreateMaintenance {
    private readonly repository;
    constructor(repository: MaintenanceRepository);
    execute(request: CreateMaintenanceRequest): Promise<Maintenance>;
}
//# sourceMappingURL=CreateMaintenance.d.ts.map