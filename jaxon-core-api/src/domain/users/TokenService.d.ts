export interface TokenPayload {
    userId: string;
    role: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}
export interface TokenService {
    generateToken(payload: TokenPayload): Promise<AuthTokens>;
    verifyToken(token: string): Promise<TokenPayload>;
}
//# sourceMappingURL=TokenService.d.ts.map