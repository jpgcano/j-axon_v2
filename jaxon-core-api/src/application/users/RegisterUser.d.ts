import { UserRole } from '../../domain/users/User.js';
import type { UserRepository } from '../../domain/users/UserRepository.js';
import type { PasswordHasher } from '../../domain/users/PasswordHasher.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
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
    private readonly auditLogger;
    constructor(userRepository: UserRepository, passwordHasher: PasswordHasher, auditLogger: AuditLogger);
    execute(request: RegisterUserRequest): Promise<void>;
}
//# sourceMappingURL=RegisterUser.d.ts.map