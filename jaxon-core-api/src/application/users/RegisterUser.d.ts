import { UserRole } from '../../domain/users/User.js';
import type { UserRepository } from '../../domain/users/UserRepository.js';
import type { PasswordHasher } from '../../domain/users/PasswordHasher.js';
export interface RegisterUserRequest {
    id: string;
    email: string;
    passwordPlain: string;
    role: UserRole;
    systemIp: string;
}
export declare class RegisterUser {
    private readonly userRepository;
    private readonly passwordHasher;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher);
    execute(request: RegisterUserRequest): Promise<void>;
}
//# sourceMappingURL=RegisterUser.d.ts.map