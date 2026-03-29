import type { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';

export class ListTickets {
  constructor(private readonly ticketRepository: TicketRepository) {}

  public async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }
}
