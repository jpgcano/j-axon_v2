/**
 * AuditLogger Adapter
 * 
 * Adapts AuditService to the AuditLogger interface
 */

import type { AuditLogger, AuditLogAction } from '../../application/audit/AuditLogger.js';
import type { AuditService } from '../services/AuditService.js';

export class AuditLoggerAdapter implements AuditLogger {
  constructor(private auditService: AuditService) {}

  async logAction(action: AuditLogAction): Promise<void> {
    await this.auditService.recordAction({
      entityName: action.entityTable,
      entityId: action.entityId,
      action: action.actionType,
      payloadBefore: action.payloadBefore,
      payloadAfter: action.payloadAfter,
      actorId: action.actorId,
      ipOrigin: action.ipOrigin,
    });
  }
}
