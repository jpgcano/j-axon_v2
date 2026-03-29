import jwt from 'jsonwebtoken';
import { TokenPayload, AuthTokens, TokenService } from '../../domain/users/TokenService.js';
import { UnauthorizedException } from '../../domain/core/exceptions.js';

export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtSecret: string,
    private readonly expiresIn: string = '1h',
    private readonly refreshExpiresIn: string = '7d'
  ) {
    if (!this.jwtSecret) {
      throw new Error('[JWT] JWT_SECRET must be defined');
    }
  }

  public async generateToken(payload: TokenPayload): Promise<AuthTokens> {
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

  public async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
