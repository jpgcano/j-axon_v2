import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authMiddleware.js';
export declare const requireRole: (allowed: Array<"ADMIN" | "MANAGER" | "TECH" | "AUDITOR">) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requireRole.d.ts.map