export interface RequestContext {
    actorId?: string;
    ipOrigin?: string;
    auditRequired?: boolean;
    auditLogged?: boolean;
}
export declare function runWithRequestContext(ctx: RequestContext, fn: () => void): void;
export declare function getRequestContext(): RequestContext;
export declare function setRequestActorId(actorId: string): void;
export declare function setRequestIpOrigin(ipOrigin: string): void;
export declare function setAuditRequired(required: boolean): void;
export declare function setAuditLogged(logged: boolean): void;
//# sourceMappingURL=RequestContext.d.ts.map