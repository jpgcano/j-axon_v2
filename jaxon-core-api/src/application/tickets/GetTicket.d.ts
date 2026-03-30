import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export declare class GetTicket {
    private readonly ticketRepository;
    constructor(ticketRepository: TicketRepository);
    execute(id: string): Promise<Ticket>;
}
//# sourceMappingURL=GetTicket.d.ts.map