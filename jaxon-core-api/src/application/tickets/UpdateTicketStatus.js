import { Ticket } from '../../domain/tickets/Ticket.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
export class UpdateTicketStatus {
    ticketRepository;
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    async execute(request) {
        const ticket = await this.ticketRepository.findById(request.id);
        if (!ticket) {
            throw new NotFoundException('Ticket', request.id);
        }
        const props = ticket.toPrimitives();
        // In a fuller implementation, domain entity logic might manage state transitions.
        const updatedProps = {
            ...props,
            status: request.status,
            updatedBy: request.actorId,
            updatedAt: new Date()
        };
        const updatedTicket = new Ticket(updatedProps);
        await this.ticketRepository.save(updatedTicket);
        return updatedTicket;
    }
}
//# sourceMappingURL=UpdateTicketStatus.js.map