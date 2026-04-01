import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../../domain/core/exceptions.js';
import { tokenService } from '../../infrastructure/di/container.js';
import { setRequestActorId } from '../../infrastructure/context/RequestContext.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1] as string;

  try {
    const payload = await tokenService.verifyToken(token);
    req.user = { id: payload.userId, role: payload.role as string };
    setRequestActorId(payload.userId);
    next();
  } catch (error) {
    next(new UnauthorizedException('Invalid or expired token'));
  }
}
