import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { Result } from 'better-result';
import { InternalError } from '../../domain/core/errors.js';
export declare class ListMaintenance {
    private readonly maintenanceRepository;
    constructor(maintenanceRepository: MaintenanceRepository);
    execute(): Promise<Result<Maintenance[], InternalError>>;
}
//# sourceMappingURL=ListMaintenance.d.ts.map