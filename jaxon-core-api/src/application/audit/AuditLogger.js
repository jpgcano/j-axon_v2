/**
 * AuditLogger Interface
 *
 * Contract for logging business actions to audit trail
 */
export var AuditActionType;
(function (AuditActionType) {
    AuditActionType["CREATE"] = "CREATE";
    AuditActionType["UPDATE"] = "UPDATE";
    AuditActionType["UPDATE_STATUS"] = "UPDATE_STATUS";
    AuditActionType["STATUS_CHANGED"] = "STATUS_CHANGED";
})(AuditActionType || (AuditActionType = {}));
//# sourceMappingURL=AuditLogger.js.map