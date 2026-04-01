export class ApplyAiSuggestionService {
    ticketRepository;
    auditLogger;
    constructor(ticketRepository, auditLogger) {
        this.ticketRepository = ticketRepository;
        this.auditLogger = auditLogger;
    }
    async execute(ticketId, recommendation, actorId, ipOrigin) {
        const ticket = await this.ticketRepository.findById(ticketId);
        if (!ticket)
            throw new Error('TICKET_NOT_FOUND');
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
//# sourceMappingURL=ApplyAiSuggestionService.js.map