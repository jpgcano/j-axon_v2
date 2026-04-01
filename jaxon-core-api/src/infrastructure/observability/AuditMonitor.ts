type MissingAuditEvent = {
  method: string;
  path: string;
  actorId?: string;
  timestamp: string;
};

let missingAuditCount = 0;
let lastMissingEvent: MissingAuditEvent | null = null;

export function recordMissingAudit(event: MissingAuditEvent): void {
  missingAuditCount += 1;
  lastMissingEvent = event;
}

export function getAuditObservability() {
  return {
    missingAuditCount,
    lastMissingEvent,
  };
}
