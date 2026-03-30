import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  actorId?: string;
  ipOrigin?: string;
  auditRequired?: boolean;
  auditLogged?: boolean;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext(ctx: RequestContext, fn: () => void): void {
  storage.run(ctx, fn);
}

export function getRequestContext(): RequestContext {
  return storage.getStore() ?? {};
}

export function setRequestActorId(actorId: string): void {
  const ctx = storage.getStore();
  if (ctx) ctx.actorId = actorId;
}

export function setRequestIpOrigin(ipOrigin: string): void {
  const ctx = storage.getStore();
  if (ctx) ctx.ipOrigin = ipOrigin;
}

export function setAuditRequired(required: boolean): void {
  const ctx = storage.getStore();
  if (ctx) ctx.auditRequired = required;
}

export function setAuditLogged(logged: boolean): void {
  const ctx = storage.getStore();
  if (ctx) ctx.auditLogged = logged;
}
