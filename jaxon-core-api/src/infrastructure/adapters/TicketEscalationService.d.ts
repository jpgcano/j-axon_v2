import type { TicketRepository } from '../ports/TicketRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export declare class TicketEscalationService {
    private ticketRepository;
    private auditLogger;
    private readonly ESCALATION_THRESHOLD_MS;
    constructor(ticketRepository: TicketRepository, auditLogger: AuditLogger);
    processPendingEscalations(): Promise<number>;
}
//# sourceMappingURL=TicketEscalationService.d.ts.map