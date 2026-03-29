export class AuditLog {
    id;
    entityName;
    entityId;
    action;
    payloadBefore;
    payloadAfter;
    actorId;
    ipOrigin;
    hashPrev;
    hashCurrent;
    createdAt;
    constructor(id, entityName, entityId, action, payloadBefore, payloadAfter, actorId, ipOrigin, hashPrev, hashCurrent, createdAt) {
        this.id = id;
        this.entityName = entityName;
        this.entityId = entityId;
        this.action = action;
        this.payloadBefore = payloadBefore;
        this.payloadAfter = payloadAfter;
        this.actorId = actorId;
        this.ipOrigin = ipOrigin;
        this.hashPrev = hashPrev;
        this.hashCurrent = hashCurrent;
        this.createdAt = createdAt;
    }
    toPrimitives() {
        return {
            id: this.id,
            entityName: this.entityName,
            entityId: this.entityId,
            action: this.action,
            payloadBefore: this.payloadBefore,
            payloadAfter: this.payloadAfter,
            actorId: this.actorId,
            ipOrigin: this.ipOrigin,
            hashPrev: this.hashPrev,
            hashCurrent: this.hashCurrent,
            createdAt: this.createdAt,
        };
    }
}
//# sourceMappingURL=AuditLog.js.map