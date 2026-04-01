import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { TicketStatus } from '../../domain/tickets/value-objects/TicketStatus.js';
import { NotFoundException, InvalidArgumentException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';

export interface CloseTicketRequest {
  id: string;
  actorId: string;
  userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR';
}

export class CloseTicket {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: CloseTicketRequest) {
    const ticket = await this.ticketRepository.findById(request.id);
    if (!ticket) {
      throw new NotFoundException('Ticket', request.id);
    }

    if (!ticket.canBeModifiedBy(request.userRole)) {
      throw new InvalidArgumentException(`User role ${request.userRole} cannot close this ticket`);
    }

    const payloadBefore = ticket.toPrimitives();

    // Use standard status transition with RBAC checks
    ticket.changeStatus(TicketStatus.closed(), request.userRole, request.actorId);

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
