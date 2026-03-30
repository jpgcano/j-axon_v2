import { randomUUID } from 'crypto';
import { AuditLog } from '../../domain/audit/AuditLog.js';
import { HashService } from '../security/HashService.js';
import { setAuditLogged } from '../context/RequestContext.js';
export class AuditService {
    auditRepository;
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async recordAction(params) {
        // 1. Get last global hash to maintain the chain of custody
        const lastLog = await this.auditRepository.findLastGlobal();
        const prevHash = lastLog ? lastLog.hashCurrent : '0'.repeat(64); // Genesis hash
        // 2. Calculate current hash (Chaining: hash_prev + action + actor + payload_after)
        const hashCurrent = HashService.chain(prevHash, params.action, params.actorId, params.payloadAfter);
        // 3. Create AuditLog entity
        const log = new AuditLog(randomUUID(), params.entityName, params.entityId, params.action, params.payloadBefore || null, params.payloadAfter, params.actorId, params.ipOrigin, prevHash, hashCurrent, new Date());
        // 4. Save (INSERT-ONLY enforced by repository/DB types)
        await this.auditRepository.save(log);
        setAuditLogged(true);
    }
}
//# sourceMappingURL=AuditService.js.map