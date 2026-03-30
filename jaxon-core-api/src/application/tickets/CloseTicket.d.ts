import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface CloseTicketRequest {
    id: string;
    actorId: string;
    userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}
export declare class CloseTicket {
    private readonly ticketRepository;
    private readonly auditLogger;
    constructor(ticketRepository: TicketRepository, auditLogger: AuditLogger);
    execute(request: CloseTicketRequest): Promise<any>;
}
//# sourceMappingURL=CloseTicket.d.ts.map