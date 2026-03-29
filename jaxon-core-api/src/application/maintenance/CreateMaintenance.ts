import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceProps } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { randomUUID } from 'crypto';

export interface CreateMaintenanceRequest {
  assetId: string;
  ticketId?: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  actorId: string;
}

export class CreateMaintenance {
  constructor(private readonly repository: MaintenanceRepository) {}

  public async execute(request: CreateMaintenanceRequest): Promise<Maintenance> {
    const id = randomUUID();
    const now = new Date();

    const props: MaintenanceProps = {
      id,
      assetId: request.assetId,
      ticketId: request.ticketId || null,
      type: request.type,
      description: request.description,
      scheduledDate: request.scheduledDate,
      completedDate: null,
      status: MaintenanceStatus.SCHEDULED,
      assignedTechId: null,
      createdBy: request.actorId,
      updatedBy: request.actorId,
      createdAt: now,
      updatedAt: now,
    };

    const maintenance = new Maintenance(props);
    await this.repository.save(maintenance);

    return maintenance;
  }
}
