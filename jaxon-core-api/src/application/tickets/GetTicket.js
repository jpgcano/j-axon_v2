import { Ticket } from '../../domain/tickets/Ticket.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
export class GetTicket {
    ticketRepository;
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    async execute(id) {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) {
            throw new NotFoundException('Ticket', id);
        }
        return ticket;
    }
}
//# sourceMappingURL=GetTicket.js.map