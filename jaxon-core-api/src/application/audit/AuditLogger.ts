/**
 * AuditLogger Interface
 * 
 * Contract for logging business actions to audit trail
 */

export interface AuditLogAction {
  entityTable: string;
  entityId: string;
  actionType: string;
  payloadBefore: any;
  payloadAfter: any;
  actorId: string;
  ipOrigin: string;
}

export interface AuditLogger {
  logAction(action: AuditLogAction): Promise<void>;
}
