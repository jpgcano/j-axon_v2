import type { TicketStatus } from '../../domain/tickets/Ticket.js';
import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export interface UpdateTicketStatusRequest {
  id: string;
  status: TicketStatus;
  actorId: string;
}

export class UpdateTicketStatus {
  constructor(private readonly ticketRepository: TicketRepository) {}

  public async execute(request: UpdateTicketStatusRequest): Promise<Ticket> {
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
