import { randomUUID } from 'crypto';
import { AuditLog } from '../../domain/audit/AuditLog.js';
import type { AuditLogRepository } from '../../domain/audit/AuditLogRepository.js';
import { HashService } from '../security/HashService.js';

export class AuditService {
  constructor(private readonly auditRepository: AuditLogRepository) {}

  public async recordAction(params: {
    entityName: string;
    entityId: string;
    action: string;
    payloadBefore?: any;
    payloadAfter: any;
    actorId: string;
    ipOrigin: string;
  }): Promise<void> {
    // 1. Get last global hash to maintain the chain of custody
    const lastLog = await this.auditRepository.findLastGlobal();
    const prevHash = lastLog ? lastLog.hashCurrent : '0'.repeat(64); // Genesis hash

    // 2. Calculate current hash (Chaining: hash_prev + current_payload)
    const hashCurrent = HashService.chain(prevHash, params.payloadAfter);

    // 3. Create AuditLog entity
    const log = new AuditLog(
      randomUUID(),
      params.entityName,
      params.entityId,
      params.action,
      params.payloadBefore || null,
      params.payloadAfter,
      params.actorId,
      params.ipOrigin,
      prevHash,
      hashCurrent,
      new Date()
    );

    // 4. Save (INSERT-ONLY enforced by repository/DB types)
    await this.auditRepository.save(log);
  }
}
