import type { TokenPayload, AuthTokens, TokenService } from '../../domain/users/TokenService.js';
export declare class JwtTokenService implements TokenService {
    private readonly jwtSecret;
    private readonly jwtPrivateKey;
    private readonly jwtPublicKey;
    private readonly expiresIn;
    private readonly refreshExpiresIn;
    constructor(jwtSecret: string | null, jwtPrivateKey: string | null, jwtPublicKey: string | null, expiresIn?: string, refreshExpiresIn?: string);
    generateToken(payload: TokenPayload): Promise<AuthTokens>;
    verifyToken(token: string): Promise<TokenPayload>;
}
//# sourceMappingURL=JwtTokenService.d.ts.map