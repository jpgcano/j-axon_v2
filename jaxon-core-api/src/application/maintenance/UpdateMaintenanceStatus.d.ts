import { Maintenance, MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import { WebSocketService } from '../../infrastructure/sockets/WebSocketService.js';
export interface UpdateMaintenanceStatusRequest {
    id: string;
    status: MaintenanceStatus;
    actorId: string;
}
import { AuditService } from '../../infrastructure/services/AuditService.js';
import { Result } from 'better-result';
import { NotFoundError, InternalError } from '../../domain/core/errors.js';
export declare class UpdateMaintenanceStatus {
    private readonly maintenanceRepository;
    private readonly wsService;
    private readonly auditService;
    constructor(maintenanceRepository: MaintenanceRepository, wsService: WebSocketService, auditService: AuditService);
    execute(request: UpdateMaintenanceStatusRequest): Promise<Result<Maintenance, NotFoundError | InternalError>>;
}
//# sourceMappingURL=UpdateMaintenanceStatus.d.ts.map