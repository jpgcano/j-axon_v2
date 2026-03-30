type MissingAuditEvent = {
    method: string;
    path: string;
    actorId?: string;
    timestamp: string;
};
export declare function recordMissingAudit(event: MissingAuditEvent): void;
export declare function getAuditObservability(): {
    missingAuditCount: number;
    lastMissingEvent: MissingAuditEvent | null;
};
export {};
//# sourceMappingURL=AuditMonitor.d.ts.map