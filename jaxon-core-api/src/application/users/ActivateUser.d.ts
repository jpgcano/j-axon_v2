import type { UserRepository } from '../../domain/users/UserRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface ActivateUserRequest {
    id: string;
    actorId: string;
    userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}
export declare class ActivateUser {
    private readonly userRepository;
    private readonly auditLogger;
    constructor(userRepository: UserRepository, auditLogger: AuditLogger);
    execute(request: ActivateUserRequest): Promise<void>;
}
//# sourceMappingURL=ActivateUser.d.ts.map