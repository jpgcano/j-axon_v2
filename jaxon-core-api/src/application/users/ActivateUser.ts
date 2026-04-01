import type { UserRepository } from '../../domain/users/UserRepository.js';
import { NotFoundException, InvalidArgumentException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface ActivateUserRequest {
  id: string;
  actorId: string;
  userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}

export class ActivateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: ActivateUserRequest): Promise<void> {
    if (request.userRole !== 'ADMIN' && request.userRole !== 'MANAGER') {
      throw new InvalidArgumentException('Only ADMIN or MANAGER can activate users');
    }

    const user = await this.userRepository.findById(request.id);
    if (!user) {
      throw new NotFoundException('User', request.id);
    }

    const payloadBefore = user.toPrimitives();

    user.activate();
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
