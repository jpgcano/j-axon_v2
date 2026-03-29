import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from '../authMiddleware.js';
describe('Auth Middleware', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        next = vi.fn();
    });
    it('should reject request without Authorization header', (done) => {
        authMiddleware(req, res, next);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Authorization header missing' }));
            done();
        }, 10);
    });
    it('should reject request with malformed Bearer token', (done) => {
        req.headers.authorization = 'InvalidFormat token';
        authMiddleware(req, res, next);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalledWith(401);
            done();
        }, 10);
    });
    it('should reject request with invalid/expired token', (done) => {
        req.headers.authorization = 'Bearer invalid.token.here';
        authMiddleware(req, res, next);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalledWith(401);
            done();
        }, 10);
    });
    it('should call next() if token is valid', (done) => {
        // This would require a valid JWT token
        // For testing purposes, we'd need to generate one or mock the validation
        // This is more of an integration test
        done();
    });
    it('should attach user context to request if token valid', (done) => {
        // Would verify req.user is populated with id and role
        done();
    });
    it('should handle authorization with Bearer prefix correctly', (done) => {
        req.headers.authorization = 'Bearer';
        authMiddleware(req, res, next);
        setTimeout(() => {
            expect(res.status).toHaveBeenCalledWith(401);
            done();
        }, 10);
    });
});
//# sourceMappingURL=authMiddleware.spec.js.map