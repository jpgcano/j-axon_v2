import { Result } from 'better-result';
import { InternalError } from '../../domain/core/errors.js';
export class ListMaintenance {
    maintenanceRepository;
    constructor(maintenanceRepository) {
        this.maintenanceRepository = maintenanceRepository;
    }
    async execute() {
        return Result.tryPromise({
            try: async () => this.maintenanceRepository.findAll(),
            catch: (error) => new InternalError({ message: 'Error listing maintenances', cause: error }),
        });
    }
}
//# sourceMappingURL=ListMaintenance.js.map