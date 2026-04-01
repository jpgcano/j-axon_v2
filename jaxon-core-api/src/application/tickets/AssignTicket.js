import { NotFoundException, InvalidArgumentException } from '../../domain/core/exceptions.js';
import { AuditActionType } from '../audit/AuditLogger.js';
import { getRequestContext } from '../../infrastructure/context/RequestContext.js';
export class AssignTicket {
    ticketRepository;
    auditLogger;
    constructor(ticketRepository, auditLogger) {
        this.ticketRepository = ticketRepository;
        this.auditLogger = auditLogger;
    }
    async execute(request) {
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
//# sourceMappingURL=AssignTicket.js.map