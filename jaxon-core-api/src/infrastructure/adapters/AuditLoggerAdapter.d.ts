/**
 * AuditLogger Adapter
 *
 * Adapts AuditService to the AuditLogger interface
 */
import type { AuditLogger, AuditLogAction } from '../../application/audit/AuditLogger.js';
import type { AuditService } from '../services/AuditService.js';
export declare class AuditLoggerAdapter implements AuditLogger {
    private auditService;
    constructor(auditService: AuditService);
    logAction(action: AuditLogAction): Promise<void>;
}
//# sourceMappingURL=AuditLoggerAdapter.d.ts.map