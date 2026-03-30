import type { TicketStatus } from '../../domain/tickets/Ticket.js';
import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
import type { AuditLogger } from '../audit/AuditLogger.js';

export interface UpdateTicketStatusRequest {
  id: string;
  status: TicketStatus;
  actorId: string;
  userRole: string; // ADMIN|MANAGER|TECH|AUDITOR
}

export class UpdateTicketStatus {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly auditLogger: AuditLogger
  ) {}

  public async execute(request: UpdateTicketStatusRequest): Promise<Ticket> {
    // Step 1: Load ticket
    const ticket = await this.ticketRepository.findById(request.id);
    if (!ticket) {
      throw new NotFoundException('Ticket', request.id);
    }

    // Step 2: Capture state before change
    const payloadBefore = ticket.toPrimitives();

    // Step 3: Apply status change with RBAC validation (throws if unauthorized)
    ticket.changeStatus(request.status, request.userRole, request.actorId);

    // Step 4: Persist changes
    await this.ticketRepository.save(ticket);

    // Step 5: Record audit trail
    const payloadAfter = ticket.toPrimitives();
    await this.auditLogger.logAction({
      entityTable: 'jaxon_tickets',
      entityId: request.id,
      actionType: 'UPDATE_STATUS',
      payloadBefore,
      payloadAfter,
      actorId: request.actorId,
      ipOrigin: '0.0.0.0/0', // TODO: get from request context
    });

    return ticket;
  }
}
