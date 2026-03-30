import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '../../domain/core/exceptions.js';

vi.mock('../../infrastructure/di/container.js', () => ({
  tokenService: {
    verifyToken: vi.fn(),
  },
}));

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { tokenService } from '../../infrastructure/di/container.js';
import type { Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it('should reject request without Authorization header', async () => {
    await authMiddleware(req, res as any, next);

    expect(next).toHaveBeenCalled();
    const err = (next as any).mock.calls[0][0];
    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.message).toBe('Missing or invalid Authorization header');
  });

  it('should reject request with malformed Bearer token', async () => {
    req.headers.authorization = 'InvalidFormat token';

    await authMiddleware(req, res as any, next);

    const err = (next as any).mock.calls[0][0];
    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.message).toBe('Missing or invalid Authorization header');
  });

  it('should reject request with invalid/expired token', async () => {
    req.headers.authorization = 'Bearer invalid.token.here';
    (tokenService.verifyToken as any).mockRejectedValueOnce(new Error('invalid'));

    await authMiddleware(req, res as any, next);

    const err = (next as any).mock.calls[0][0];
    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.message).toBe('Invalid or expired token');
  });

  it('should call next() if token is valid', async () => {
    req.headers.authorization = 'Bearer valid.token.here';
    (tokenService.verifyToken as any).mockResolvedValueOnce({ userId: 'user-1', role: 'TECH' });

    await authMiddleware(req, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((next as any).mock.calls[0][0]).toBeUndefined();
  });

  it('should attach user context to request if token valid', async () => {
    req.headers.authorization = 'Bearer valid.token.here';
    (tokenService.verifyToken as any).mockResolvedValueOnce({ userId: 'user-2', role: 'ADMIN' });

    await authMiddleware(req, res as any, next);

    expect(req.user).toEqual({ id: 'user-2', role: 'ADMIN' });
  });

  it('should handle authorization with Bearer prefix correctly', async () => {
    req.headers.authorization = 'Bearer';

    await authMiddleware(req, res as any, next);

    const err = (next as any).mock.calls[0][0];
    expect(err).toBeInstanceOf(UnauthorizedException);
    expect(err.message).toBe('Missing or invalid Authorization header');
  });
});
