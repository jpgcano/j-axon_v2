import type { TicketRepository } from './domain/tickets/TicketRepository.js';
import type { AuditLogger } from './application/audit/AuditLogger.js';

export class ApplyAiSuggestionService {
  constructor(
    private ticketRepository: TicketRepository,
    private auditLogger: AuditLogger
  ) {}

  async execute(ticketId: string, recommendation: string, actorId: string, ipOrigin: string) {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) throw new Error('TICKET_NOT_FOUND');

    const payloadBefore = { ...ticket };

    // Actualizamos el ticket con la recomendación de la IA validada por el humano (Human-in-the-loop)
    const updatedTicket = await this.ticketRepository.update(ticketId, {
      resolutionDetails: recommendation,
      metadata: { 
        ...ticket.metadata, 
        ai_applied: true, 
        applied_by: actorId,
        validation_timestamp: new Date().toISOString()
      }
    });

    // Auditoría Forense (Regla 03: Human-in-the-loop audit)
    await this.auditLogger.logAction({
      entityTable: 'jaxon_tickets',
      entityId: ticketId,
      actionType: 'IA_SUGGESTION_APPLIED',
      actorId,
      ipOrigin,
      payloadBefore,
      payloadAfter: updatedTicket
    });
  }
}
