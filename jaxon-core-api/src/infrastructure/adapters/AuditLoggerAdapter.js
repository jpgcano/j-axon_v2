/**
 * AuditLogger Adapter
 *
 * Adapts AuditService to the AuditLogger interface
 */
import { createHash } from 'node:crypto';
export class AuditLoggerAdapter {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    async logAction(action) {
        try {
            // Tarea 3.2: Implementación de encadenamiento criptográfico (Regla 01)
            const lastEntry = await this.auditService.getLastEntry();
            const prevHash = lastEntry ? lastEntry.hashCurrent : '0'.repeat(64);
            // Se incluyen todos los campos para garantizar inmutabilidad total (Regla 01)
            const hashInput = JSON.stringify({
                entityTable: action.entityTable,
                entityId: action.entityId,
                actionType: action.actionType,
                payloadBefore: action.payloadBefore,
                payloadAfter: action.payloadAfter,
                actorId: action.actorId,
                ipOrigin: action.ipOrigin,
                prevHash,
                salt: process.env.MASTER_SALT_HASH || 'default_salt'
            });
            const currentHash = createHash('sha256')
                .update(hashInput)
                .digest('hex');
            await this.auditService.recordAction({
                entityName: action.entityTable,
                entityId: action.entityId,
                action: action.actionType,
                payloadBefore: action.payloadBefore,
                payloadAfter: action.payloadAfter,
                actorId: action.actorId,
                ipOrigin: action.ipOrigin,
                hashPrev: prevHash,
                hashCurrent: currentHash
            });
        }
        catch (error) {
            console.error(`[AuditLoggerAdapter] Error recording action: ${error.message}`);
            throw new Error('FAILED_TO_RECORD_AUDIT');
        }
    }
}
//# sourceMappingURL=AuditLoggerAdapter.js.map