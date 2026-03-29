import { Ticket, RiskLevel } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export interface CreateTicketRequest {
    issueDescription: string;
    assetId: string;
    inherentRiskLevel?: RiskLevel;
    actorId: string;
}
export declare class CreateTicket {
    private readonly ticketRepository;
    constructor(ticketRepository: TicketRepository);
    execute(request: CreateTicketRequest): Promise<Ticket>;
}
//# sourceMappingURL=CreateTicket.d.ts.map