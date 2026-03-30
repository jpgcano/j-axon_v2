import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authMiddleware.js';

export const requireRole = (allowed: Array<'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const role = req.user?.role as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR' | undefined;
    if (!role) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowed.includes(role)) {
      res.status(403).json({ error: 'Forbidden: insufficient role' });
      return;
    }

    next();
  };
};
