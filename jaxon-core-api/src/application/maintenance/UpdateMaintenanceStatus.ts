import { Maintenance, MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
import { WebSocketService } from '../../infrastructure/sockets/WebSocketService.js';

export interface UpdateMaintenanceStatusRequest {
  id: string;
  status: MaintenanceStatus;
  actorId: string;
}

import { AuditService } from '../../infrastructure/services/AuditService.js';
import { Result } from 'better-result';
import { NotFoundError, InternalError } from '../../domain/core/errors.js';

export class UpdateMaintenanceStatus {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly wsService: WebSocketService,
    private readonly auditService: AuditService
  ) {}

  public async execute(request: UpdateMaintenanceStatusRequest): Promise<Result<Maintenance, NotFoundError | InternalError>> {
    return Result.tryPromise({
      try: async () => {
        const maintenance = await this.maintenanceRepository.findById(request.id);

        if (!maintenance) {
          throw new NotFoundError({ entity: 'Maintenance', id: request.id });
        }

        const payloadBefore = maintenance.toPrimitives();

        if (request.status === MaintenanceStatus.IN_PROGRESS) {
          maintenance.start(request.actorId);
        } else if (request.status === MaintenanceStatus.COMPLETED) {
          maintenance.complete(request.actorId);
        } else if (request.status === MaintenanceStatus.CANCELLED) {
          maintenance.cancel(request.actorId);
        }

        await this.maintenanceRepository.save(maintenance);

        const payloadAfter = maintenance.toPrimitives();

        // Forensic Audit Log
        await this.auditService.recordAction({
          entityName: 'jaxon_maintenance',
          entityId: request.id,
          action: `UPDATE_STATUS_${request.status}`,
          payloadBefore,
          payloadAfter,
          actorId: request.actorId,
          ipOrigin: '127.0.0.1',
        });

        // Emit Real-Time Event
        this.wsService.emitEvent('maintenance:updated', payloadAfter);

        return maintenance;
      },
      catch: (error) => {
        if (error instanceof NotFoundError) return error;
        return new InternalError({ message: 'Error updating maintenance status', cause: error });
      },
    });
  }
}
