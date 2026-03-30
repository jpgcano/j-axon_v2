import type { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export declare class ListTickets {
    private readonly ticketRepository;
    constructor(ticketRepository: TicketRepository);
    execute(): Promise<Ticket[]>;
}
//# sourceMappingURL=ListTickets.d.ts.map