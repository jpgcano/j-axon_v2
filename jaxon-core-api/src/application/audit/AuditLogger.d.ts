/**
 * AuditLogger Interface
 *
 * Contract for logging business actions to audit trail
 */
export declare enum AuditActionType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    UPDATE_STATUS = "UPDATE_STATUS",
    STATUS_CHANGED = "STATUS_CHANGED"
}
export interface AuditLogAction {
    entityTable: string;
    entityId: string;
    actionType: AuditActionType;
    payloadBefore: any;
    payloadAfter: any;
    actorId: string;
    ipOrigin: string;
}
export interface AuditLogger {
    logAction(action: AuditLogAction): Promise<void>;
}
//# sourceMappingURL=AuditLogger.d.ts.map