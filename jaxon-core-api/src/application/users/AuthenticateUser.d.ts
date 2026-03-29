import type { UserRepository } from '../../domain/users/UserRepository.js';
import type { PasswordHasher } from '../../domain/users/PasswordHasher.js';
import type { TokenService, AuthTokens } from '../../domain/users/TokenService.js';
export interface AuthenticateUserRequest {
    email: string;
    passwordPlain: string;
}
export declare class AuthenticateUser {
    private readonly userRepository;
    private readonly passwordHasher;
    private readonly tokenService;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher, tokenService: TokenService);
    execute(request: AuthenticateUserRequest): Promise<AuthTokens>;
}
//# sourceMappingURL=AuthenticateUser.d.ts.map