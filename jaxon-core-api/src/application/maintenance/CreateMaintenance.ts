import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { randomUUID } from 'crypto';
import { WebSocketService } from '../../infrastructure/sockets/WebSocketService.js';

export interface CreateMaintenanceRequest {
  assetId: string;
  ticketId?: string | null;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  assignedTechId?: string | null;
  createdBy: string;
}

import { AuditService } from '../../infrastructure/services/AuditService.js';
import { Result } from 'better-result';
import { InternalError } from '../../domain/core/errors.js';

export class CreateMaintenance {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly wsService: WebSocketService,
    private readonly auditService: AuditService
  ) {}

  public async execute(request: CreateMaintenanceRequest): Promise<Result<Maintenance, InternalError>> {
    return Result.tryPromise({
      try: async () => {
        const now = new Date();
        const maintenance = new Maintenance({
          id: randomUUID(),
          assetId: request.assetId,
          ticketId: request.ticketId || null,
          type: request.type,
          description: request.description,
          scheduledDate: request.scheduledDate,
          completedDate: null,
          status: MaintenanceStatus.SCHEDULED,
          assignedTechId: request.assignedTechId || null,
          createdBy: request.createdBy,
          updatedBy: request.createdBy,
          createdAt: now,
          updatedAt: now,
        });

        await this.maintenanceRepository.save(maintenance);

        const maintenancePrimitives = maintenance.toPrimitives();

        // Forensic Audit Log
        await this.auditService.recordAction({
          entityName: 'jaxon_maintenance',
          entityId: maintenancePrimitives.id,
          action: 'CREATE',
          payloadAfter: maintenancePrimitives,
          actorId: request.createdBy,
          ipOrigin: '127.0.0.1',
        });

        // Emit Real-Time Event
        this.wsService.emitEvent('maintenance:scheduled', maintenancePrimitives);

        return maintenance;
      },
      catch: (error) => new InternalError({ message: 'Error scheduling maintenance', cause: error }),
    });
  }
}
