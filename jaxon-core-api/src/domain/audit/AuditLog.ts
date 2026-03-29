export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly entityName: string,
    public readonly entityId: string,
    public readonly action: string,
    public readonly payloadBefore: any,
    public readonly payloadAfter: any,
    public readonly actorId: string,
    public readonly ipOrigin: string,
    public readonly hashPrev: string,
    public readonly hashCurrent: string,
    public readonly createdAt: Date
  ) {}

  public toPrimitives() {
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
