import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
export declare class ListMaintenance {
    private readonly repository;
    constructor(repository: MaintenanceRepository);
    execute(): Promise<Maintenance[]>;
}
//# sourceMappingURL=ListMaintenance.d.ts.map