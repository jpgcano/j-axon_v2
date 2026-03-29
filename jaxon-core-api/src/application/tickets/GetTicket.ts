import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export class GetTicket {
  constructor(private readonly ticketRepository: TicketRepository) {}

  public async execute(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException('Ticket', id);
    }

    return ticket;
  }
}
