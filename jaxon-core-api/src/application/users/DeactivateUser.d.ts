import type { UserRepository } from '../../domain/users/UserRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface DeactivateUserRequest {
    id: string;
    actorId: string;
    userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}
export declare class DeactivateUser {
    private readonly userRepository;
    private readonly auditLogger;
    constructor(userRepository: UserRepository, auditLogger: AuditLogger);
    execute(request: DeactivateUserRequest): Promise<void>;
}
//# sourceMappingURL=DeactivateUser.d.ts.map