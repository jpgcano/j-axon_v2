import jwt from 'jsonwebtoken';
import type { TokenPayload, AuthTokens, TokenService } from '../../domain/users/TokenService.js';
import { UnauthorizedException } from '../../domain/core/exceptions.js';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtSecret: string | null,
    private readonly jwtPrivateKey: string | null,
    private readonly jwtPublicKey: string | null,
    private readonly expiresIn: string = '1h',
    private readonly refreshExpiresIn: string = '7d'
  ) {
    if (!this.jwtSecret && (!this.jwtPrivateKey || !this.jwtPublicKey)) {
      throw new Error('[JWT] JWT_SECRET or JWT_PRIVATE_KEY/JWT_PUBLIC_KEY must be defined');
    }
  }

  public async generateToken(payload: TokenPayload): Promise<AuthTokens> {
    const useAsymmetric = !!(this.jwtPrivateKey && this.jwtPublicKey);
    const signKey = useAsymmetric ? this.jwtPrivateKey! : this.jwtSecret!;
    const algorithm = useAsymmetric ? 'RS256' : 'HS256';

    const accessToken = jwt.sign(payload, signKey, {
      algorithm,
      expiresIn: this.expiresIn as any,
    });

    const refreshToken = jwt.sign({ userId: payload.userId }, signKey, {
      algorithm,
      expiresIn: this.refreshExpiresIn as any,
    });

    return { 
      accessToken,
      refreshToken
    };
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const useAsymmetric = !!(this.jwtPrivateKey && this.jwtPublicKey);
      const verifyKey = useAsymmetric ? this.jwtPublicKey! : this.jwtSecret!;
      const algorithms = [useAsymmetric ? 'RS256' : 'HS256'] as jwt.Algorithm[];
      const decoded = jwt.verify(token, verifyKey, { algorithms }) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
