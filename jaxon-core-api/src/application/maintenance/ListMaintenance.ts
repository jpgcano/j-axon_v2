import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { Result } from '../../domain/core/Result.js';
import { InternalError } from '../../domain/core/errors.js';

export class ListMaintenance {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  public async execute(): Promise<Result<Maintenance[], InternalError>> {
    return Result.tryPromise({
      try: async () => this.maintenanceRepository.findAll(),
      catch: (error) => new InternalError({ message: 'Error listing maintenances', cause: error }),
    });
  }
}
