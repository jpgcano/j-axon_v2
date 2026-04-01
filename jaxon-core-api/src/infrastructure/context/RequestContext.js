import { AsyncLocalStorage } from 'node:async_hooks';
const storage = new AsyncLocalStorage();
export function runWithRequestContext(ctx, fn) {
    storage.run(ctx, fn);
}
export function getRequestContext() {
    return storage.getStore() ?? {};
}
export function setRequestActorId(actorId) {
    const ctx = storage.getStore();
    if (ctx)
        ctx.actorId = actorId;
}
export function setRequestIpOrigin(ipOrigin) {
    const ctx = storage.getStore();
    if (ctx)
        ctx.ipOrigin = ipOrigin;
}
export function setAuditRequired(required) {
    const ctx = storage.getStore();
    if (ctx)
        ctx.auditRequired = required;
}
export function setAuditLogged(logged) {
    const ctx = storage.getStore();
    if (ctx)
        ctx.auditLogged = logged;
}
//# sourceMappingURL=RequestContext.js.map