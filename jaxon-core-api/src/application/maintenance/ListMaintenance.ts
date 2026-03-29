import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';

export class ListMaintenance {
  constructor(private readonly repository: MaintenanceRepository) {}

  public async execute(): Promise<Maintenance[]> {
    return await this.repository.findAll();
  }
}
