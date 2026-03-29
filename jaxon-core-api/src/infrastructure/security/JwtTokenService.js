import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../../domain/core/exceptions.js';
export class JwtTokenService {
    jwtSecret;
    expiresIn;
    refreshExpiresIn;
    constructor(jwtSecret, expiresIn = '1h', refreshExpiresIn = '7d') {
        this.jwtSecret = jwtSecret;
        this.expiresIn = expiresIn;
        this.refreshExpiresIn = refreshExpiresIn;
        if (!this.jwtSecret) {
            throw new Error('[JWT] JWT_SECRET must be defined');
        }
    }
    async generateToken(payload) {
        const accessToken = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.expiresIn,
        });
        const refreshToken = jwt.sign({ userId: payload.userId }, this.jwtSecret, {
            expiresIn: this.refreshExpiresIn,
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return decoded;
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
//# sourceMappingURL=JwtTokenService.js.map