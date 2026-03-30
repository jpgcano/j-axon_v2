import type { Request, Response, NextFunction } from 'express';
import { getRequestContext, setAuditRequired } from '../../infrastructure/context/RequestContext.js';
import { recordMissingAudit } from '../../infrastructure/observability/AuditMonitor.js';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const shouldEnforce = process.env.AUDIT_ENFORCEMENT !== 'off';

export function auditMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!MUTATION_METHODS.has(req.method)) {
    next();
    return;
  }

  if (!shouldEnforce) {
    next();
    return;
  }

  setAuditRequired(true);

  res.on('finish', () => {
    const ctx = getRequestContext();
    if (ctx.auditRequired && !ctx.auditLogged) {
      recordMissingAudit({
        method: req.method,
        path: req.originalUrl,
        actorId: ctx.actorId,
        timestamp: new Date().toISOString(),
      });

      const message = `Mutation without audit log: ${req.method} ${req.originalUrl} actor=${ctx.actorId ?? 'unknown'}`;
      if (process.env.AUDIT_ENFORCEMENT === 'hard') {
        console.error(`[AUDIT ERROR] ${message}`);
      } else {
        console.warn(`[AUDIT WARNING] ${message}`);
      }
    }
  });

  next();
}
