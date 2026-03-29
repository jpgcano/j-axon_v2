import type { MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
export interface UpdateMaintenanceStatusRequest {
    id: string;
    status: MaintenanceStatus;
    actorId: string;
}
export declare class UpdateMaintenanceStatus {
    private readonly repository;
    constructor(repository: MaintenanceRepository);
    execute(request: UpdateMaintenanceStatusRequest): Promise<Maintenance>;
}
//# sourceMappingURL=UpdateMaintenanceStatus.d.ts.map