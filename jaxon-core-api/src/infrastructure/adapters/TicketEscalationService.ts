import type { TicketRepository } from '../ports/TicketRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';

export class TicketEscalationService {
  private readonly ESCALATION_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4 Horas

  constructor(
    private ticketRepository: TicketRepository,
    private auditLogger: AuditLogger
  ) {}

  async processPendingEscalations(): Promise<number> {
    const now = new Date();
    const highRiskTickets = await this.ticketRepository.findPendingHighRisk();
    let escalatedCount = 0;

    for (const ticket of highRiskTickets) {
      const timeDiff = now.getTime() - ticket.createdAt.getTime();

      if (timeDiff > this.ESCALATION_THRESHOLD_MS) {
        try {
          await this.ticketRepository.update(ticket.id, {
            assignedTo: 'CRO_ROLE_ID', // ID del rol Chief Risk Officer
            metadata: { ...ticket.metadata, escalated: true, reason: 'SLA_EXCEEDED' }
          });

          await this.auditLogger.logAction({
            entityTable: 'jaxon_tickets',
            entityId: ticket.id,
            actionType: 'AUTO_ESCALATION',
            actorId: 'SYSTEM_SCHEDULER',
            ipOrigin: '127.0.0.1'
          });

          escalatedCount++;
        } catch (err) {
          console.error(`[TicketEscalationService] Failed to escalate ticket ${ticket.id}: ${(err as Error).message}`);
        }
      }
    }
    return escalatedCount;
  }
}