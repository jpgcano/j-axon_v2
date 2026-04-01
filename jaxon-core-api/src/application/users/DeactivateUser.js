import { NotFoundException, InvalidArgumentException } from '../../domain/core/exceptions.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class DeactivateUser {
    userRepository;
    auditLogger;
    constructor(userRepository, auditLogger) {
        this.userRepository = userRepository;
        this.auditLogger = auditLogger;
    }
    async execute(request) {
        if (request.userRole !== 'ADMIN' && request.userRole !== 'MANAGER') {
            throw new InvalidArgumentException('Only ADMIN or MANAGER can deactivate users');
        }
        const user = await this.userRepository.findById(request.id);
        if (!user) {
            throw new NotFoundException('User', request.id);
        }
        const payloadBefore = user.toPrimitives();
        user.deactivate();
        await this.userRepository.save(user);
        const payloadAfter = user.toPrimitives();
        await this.auditLogger.logAction({
            entityTable: 'jaxon_users',
            entityId: request.id,
            actionType: AuditActionType.UPDATE,
            payloadBefore,
            payloadAfter,
            actorId: request.actorId,
            ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
        });
    }
}
//# sourceMappingURL=DeactivateUser.js.map