import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface AssignTicketRequest {
    id: string;
    techId: string;
    actorId: string;
    userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}
export declare class AssignTicket {
    private readonly ticketRepository;
    private readonly auditLogger;
    constructor(ticketRepository: TicketRepository, auditLogger: AuditLogger);
    execute(request: AssignTicketRequest): Promise<any>;
}
//# sourceMappingURL=AssignTicket.d.ts.map