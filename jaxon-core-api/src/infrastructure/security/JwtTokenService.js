import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../../domain/core/exceptions.js';
export class JwtTokenService {
    jwtSecret;
    jwtPrivateKey;
    jwtPublicKey;
    expiresIn;
    refreshExpiresIn;
    constructor(jwtSecret, jwtPrivateKey, jwtPublicKey, expiresIn = '1h', refreshExpiresIn = '7d') {
        this.jwtSecret = jwtSecret;
        this.jwtPrivateKey = jwtPrivateKey;
        this.jwtPublicKey = jwtPublicKey;
        this.expiresIn = expiresIn;
        this.refreshExpiresIn = refreshExpiresIn;
        if (!this.jwtSecret && (!this.jwtPrivateKey || !this.jwtPublicKey)) {
            throw new Error('[JWT] JWT_SECRET or JWT_PRIVATE_KEY/JWT_PUBLIC_KEY must be defined');
        }
    }
    async generateToken(payload) {
        const useAsymmetric = !!(this.jwtPrivateKey && this.jwtPublicKey);
        const signKey = useAsymmetric ? this.jwtPrivateKey : this.jwtSecret;
        const algorithm = useAsymmetric ? 'RS256' : 'HS256';
        const accessToken = jwt.sign(payload, signKey, {
            algorithm,
            expiresIn: this.expiresIn,
        });
        const refreshToken = jwt.sign({ userId: payload.userId }, signKey, {
            algorithm,
            expiresIn: this.refreshExpiresIn,
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async verifyToken(token) {
        try {
            const useAsymmetric = !!(this.jwtPrivateKey && this.jwtPublicKey);
            const verifyKey = useAsymmetric ? this.jwtPublicKey : this.jwtSecret;
            const algorithms = [useAsymmetric ? 'RS256' : 'HS256'];
            const decoded = jwt.verify(token, verifyKey, { algorithms });
            return decoded;
        }
        catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
//# sourceMappingURL=JwtTokenService.js.map