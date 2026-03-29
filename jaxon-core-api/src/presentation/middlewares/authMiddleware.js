import { UnauthorizedException } from '../../domain/core/exceptions.js';
import { tokenService } from '../../infrastructure/di/container.js';
export async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedException('Missing or invalid Authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = await tokenService.verifyToken(token);
        req.user = { id: payload.userId, role: payload.role };
        next();
    }
    catch (error) {
        next(new UnauthorizedException('Invalid or expired token'));
    }
}
//# sourceMappingURL=authMiddleware.js.map