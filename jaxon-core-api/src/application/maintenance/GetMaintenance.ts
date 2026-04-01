import type { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export class GetMaintenance {
  constructor(private readonly repository: MaintenanceRepository) {}

  public async execute(id: string): Promise<Maintenance> {
    const maintenance = await this.repository.findById(id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance', id);
    }

    return maintenance;
  }
}
