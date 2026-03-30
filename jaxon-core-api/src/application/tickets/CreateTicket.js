import { Ticket, TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
import { randomUUID } from 'crypto';
export class CreateTicket {
    ticketRepository;
    constructor(ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    async execute(request) {
        const ticketId = randomUUID();
        const now = new Date();
        const props = {
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
//# sourceMappingURL=CreateTicket.js.map