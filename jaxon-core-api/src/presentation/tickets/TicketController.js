import { z } from 'zod';
import { TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
const createTicketSchema = z.object({
    issueDescription: z.string().min(5),
    assetId: z.string().uuid(),
    inherentRiskLevel: z.nativeEnum(RiskLevel).optional(),
});
const updateStatusSchema = z.object({
    status: z.nativeEnum(TicketStatus),
});
export class TicketController {
    createTicket;
    listTickets;
    getTicket;
    updateTicketStatus;
    constructor(createTicket, listTickets, getTicket, updateTicketStatus) {
        this.createTicket = createTicket;
        this.listTickets = listTickets;
        this.getTicket = getTicket;
        this.updateTicketStatus = updateTicketStatus;
    }
    create = async (req, res, next) => {
        try {
            const data = createTicketSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const payload = {
                issueDescription: data.issueDescription,
                assetId: data.assetId,
                actorId,
            };
            if (data.inherentRiskLevel)
                payload.inherentRiskLevel = data.inherentRiskLevel;
            const ticket = await this.createTicket.execute(payload);
            res.status(201).json(ticket.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const tickets = await this.listTickets.execute();
            res.status(200).json(tickets.map(t => t.toPrimitives()));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const ticket = await this.getTicket.execute(id);
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = updateStatusSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const ticket = await this.updateTicketStatus.execute({
                id: id,
                status: data.status,
                actorId,
            });
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=TicketController.js.map