import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { NotFoundException, InvalidArgumentException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface AssignTicketRequest {
  id: string;
  techId: string;
  actorId: string;
  userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}

export class AssignTicket {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: AssignTicketRequest) {
    const ticket = await this.ticketRepository.findById(request.id);
    if (!ticket) {
      throw new NotFoundException('Ticket', request.id);
    }

    if (!ticket.canBeModifiedBy(request.userRole)) {
      throw new InvalidArgumentException(`User role ${request.userRole} cannot assign this ticket`);
    }

    const payloadBefore = ticket.toPrimitives();

    ticket.assignToTech(request.techId, request.actorId);

    await this.ticketRepository.save(ticket);

    const payloadAfter = ticket.toPrimitives();
    await this.auditLogger.logAction({
      entityTable: 'jaxon_tickets',
      entityId: request.id,
      actionType: AuditActionType.UPDATE_STATUS,
      payloadBefore,
      payloadAfter,
      actorId: request.actorId,
      ipOrigin: getRequestContext().ipOrigin || '0.0.0.0',
    });

    return ticket;
  }
}
