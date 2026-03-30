import type { TicketStatus } from '../../domain/tickets/Ticket.js';
import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface UpdateTicketStatusRequest {
    id: string;
    status: TicketStatus;
    actorId: string;
    userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}
export declare class UpdateTicketStatus {
    private readonly ticketRepository;
    private readonly auditLogger;
    constructor(ticketRepository: TicketRepository, auditLogger: AuditLogger);
    execute(request: UpdateTicketStatusRequest): Promise<Ticket>;
}
//# sourceMappingURL=UpdateTicketStatus.d.ts.map