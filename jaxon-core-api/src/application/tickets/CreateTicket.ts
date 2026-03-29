import { Ticket, TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
import type { TicketProps } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { randomUUID } from 'crypto';

export interface CreateTicketRequest {
  issueDescription: string;
  assetId: string;
  inherentRiskLevel?: RiskLevel;
  actorId: string;
}

export class CreateTicket {
  constructor(private readonly ticketRepository: TicketRepository) {}

  public async execute(request: CreateTicketRequest): Promise<Ticket> {
    const ticketId = randomUUID();
    const now = new Date();

    const props: TicketProps = {
      id: ticketId,
      issueDescription: request.issueDescription,
      status: TicketStatus.OPEN,
      inherentRiskLevel: request.inherentRiskLevel || RiskLevel.LOW,
      assetId: request.assetId,
      assignedTechId: null,
      approvedById: null,
      createdBy: request.actorId,
      updatedBy: request.actorId,
      createdAt: now,
      updatedAt: now,
    };

    const ticket = new Ticket(props);
    await this.ticketRepository.save(ticket);

    return ticket;
  }
}
