import type { AuditLogRepository } from '../../domain/audit/AuditLogRepository.js';
export declare class AuditService {
    private readonly auditRepository;
    constructor(auditRepository: AuditLogRepository);
    recordAction(params: {
        entityName: string;
        entityId: string;
        action: string;
        payloadBefore?: any;
        payloadAfter: any;
        actorId: string;
        ipOrigin: string;
    }): Promise<void>;
}
//# sourceMappingURL=AuditService.d.ts.map