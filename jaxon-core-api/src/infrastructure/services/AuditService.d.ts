import type { AuditLogRepository } from '../../domain/audit/AuditLogRepository.js';
import type { AuditActionType } from '../../application/audit/AuditLogger.js';
export declare class AuditService {
    private readonly auditRepository;
    constructor(auditRepository: AuditLogRepository);
    recordAction(params: {
        entityName: string;
        entityId: string;
        action: AuditActionType;
        payloadBefore?: any;
        payloadAfter: any;
        actorId: string;
        ipOrigin: string;
    }): Promise<void>;
}
//# sourceMappingURL=AuditService.d.ts.map