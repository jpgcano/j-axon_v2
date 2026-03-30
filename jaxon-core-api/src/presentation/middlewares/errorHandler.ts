import type { Request, Response, NextFunction } from 'express';
import { DomainException, UnauthorizedException, InvalidArgumentException, NotFoundException, ConflictException } from '../../domain/core/exceptions.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);

  if (err instanceof UnauthorizedException) {
    res.status(401).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof NotFoundException) {
    res.status(404).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof InvalidArgumentException) {
    res.status(400).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof ConflictException) {
    res.status(409).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof DomainException) {
    res.status(400).json({ error: err.message, code: err.code });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: (err as any).errors.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
    });
    return;
  }

  // Fallback for unexpected errors
  res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
}
