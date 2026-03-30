import { Maintenance, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
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
export declare class CreateMaintenance {
    private readonly maintenanceRepository;
    private readonly wsService;
    private readonly auditService;
    constructor(maintenanceRepository: MaintenanceRepository, wsService: WebSocketService, auditService: AuditService);
    execute(request: CreateMaintenanceRequest): Promise<Result<Maintenance, InternalError>>;
}
//# sourceMappingURL=CreateMaintenance.d.ts.map