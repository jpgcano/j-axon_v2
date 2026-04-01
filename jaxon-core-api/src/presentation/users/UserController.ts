import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import type { DeactivateUser } from '../../application/users/DeactivateUser.js';
import type { ActivateUser } from '../../application/users/ActivateUser.js';

const deactivateSchema = z.object({
  reason: z.string().min(3).optional(),
}).strict();

export class UserController {
  constructor(
    private readonly deactivateUser: DeactivateUser,
    private readonly activateUser: ActivateUser
  ) {}

  public deactivate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      deactivateSchema.parse(req.body ?? {});

      const actorId = req.user?.id;
      const userRole = req.user?.role;

      if (!actorId || !userRole) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      await this.deactivateUser.execute({
        id: id as string,
        actorId,
        userRole: userRole as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR',
      });

      res.status(200).json({ status: 'deactivated', id });
    } catch (error) {
      next(error);
    }
  };

  public activate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      deactivateSchema.parse(req.body ?? {});

      const actorId = req.user?.id;
      const userRole = req.user?.role;

      if (!actorId || !userRole) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      await this.activateUser.execute({
        id: id as string,
        actorId,
        userRole: userRole as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR',
      });

      res.status(200).json({ status: 'activated', id });
    } catch (error) {
      next(error);
    }
  };
}
