export class TicketEscalationService {
    ticketRepository;
    auditLogger;
    ESCALATION_THRESHOLD_MS = 4 * 60 * 60 * 1000; // 4 Horas
    constructor(ticketRepository, auditLogger) {
        this.ticketRepository = ticketRepository;
        this.auditLogger = auditLogger;
    }
    async processPendingEscalations() {
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
                }
                catch (err) {
                    console.error(`[TicketEscalationService] Failed to escalate ticket ${ticket.id}: ${err.message}`);
                }
            }
        }
        return escalatedCount;
    }
}
//# sourceMappingURL=TicketEscalationService.js.map