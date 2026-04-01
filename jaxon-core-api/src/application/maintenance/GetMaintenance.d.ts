import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
export declare class GetMaintenance {
    private readonly repository;
    constructor(repository: MaintenanceRepository);
    execute(id: string): Promise<Maintenance>;
}
//# sourceMappingURL=GetMaintenance.d.ts.map