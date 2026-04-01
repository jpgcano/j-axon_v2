import type { TicketRepository } from './infrastructure/ports/TicketRepository.js';
import type { AuditLogger } from './application/audit/AuditLogger.js';
export declare class ApplyAiSuggestionService {
    private ticketRepository;
    private auditLogger;
    constructor(ticketRepository: TicketRepository, auditLogger: AuditLogger);
    execute(ticketId: string, recommendation: string, actorId: string, ipOrigin: string): Promise<void>;
}
//# sourceMappingURL=ApplyAiSuggestionService.d.ts.map