import type { MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import { Maintenance } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export interface UpdateMaintenanceStatusRequest {
  id: string;
  status: MaintenanceStatus;
  actorId: string;
}

export class UpdateMaintenanceStatus {
  constructor(private readonly repository: MaintenanceRepository) {}

  public async execute(request: UpdateMaintenanceStatusRequest): Promise<Maintenance> {
    const maintenance = await this.repository.findById(request.id);

    if (!maintenance) {
      throw new NotFoundException('Maintenance', request.id);
    }

    maintenance.updateStatus(request.status, request.actorId);
    await this.repository.save(maintenance);

    return maintenance;
  }
}
