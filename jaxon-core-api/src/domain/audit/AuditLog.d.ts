export declare class AuditLog {
    readonly id: string;
    readonly entityName: string;
    readonly entityId: string;
    readonly action: string;
    readonly payloadBefore: any;
    readonly payloadAfter: any;
    readonly actorId: string;
    readonly ipOrigin: string;
    readonly hashPrev: string;
    readonly hashCurrent: string;
    readonly createdAt: Date;
    constructor(id: string, entityName: string, entityId: string, action: string, payloadBefore: any, payloadAfter: any, actorId: string, ipOrigin: string, hashPrev: string, hashCurrent: string, createdAt: Date);
    toPrimitives(): {
        id: string;
        entityName: string;
        entityId: string;
        action: string;
        payloadBefore: any;
        payloadAfter: any;
        actorId: string;
        ipOrigin: string;
        hashPrev: string;
        hashCurrent: string;
        createdAt: Date;
    };
}
//# sourceMappingURL=AuditLog.d.ts.map