let missingAuditCount = 0;
let lastMissingEvent = null;
export function recordMissingAudit(event) {
    missingAuditCount += 1;
    lastMissingEvent = event;
}
export function getAuditObservability() {
    return {
        missingAuditCount,
        lastMissingEvent,
    };
}
//# sourceMappingURL=AuditMonitor.js.map