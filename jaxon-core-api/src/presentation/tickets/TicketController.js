import { z } from 'zod';
import { TicketStatus, TicketStatusEnum, RiskLevel } from '../../domain/tickets/index.js';
import { RiskAssessmentService } from '../../RiskAssessmentService.js';
const createTicketSchema = z.object({
    issueDescription: z.string().min(5),
    assetId: z.string().uuid(),
    inherentRiskLevel: z.nativeEnum(RiskLevel).optional(),
    probability: z.number().min(1).max(5).optional(),
    consequence: z.number().min(1).max(5).optional(),
}).strict();
const updateStatusSchema = z.object({
    status: z.nativeEnum(TicketStatusEnum),
}).strict();
const assignTicketSchema = z.object({
    techId: z.string().uuid(),
}).strict();
export class TicketController {
    createTicket;
    listTickets;
    getTicket;
    updateTicketStatus;
    closeTicket;
    assignTicket;
    riskAssessmentService;
    constructor(createTicket, listTickets, getTicket, updateTicketStatus, closeTicket, assignTicket, riskAssessmentService = new RiskAssessmentService()) {
        this.createTicket = createTicket;
        this.listTickets = listTickets;
        this.getTicket = getTicket;
        this.updateTicketStatus = updateTicketStatus;
        this.closeTicket = closeTicket;
        this.assignTicket = assignTicket;
        this.riskAssessmentService = riskAssessmentService;
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
            // Cálculo automático de ERM (Regla de Negocio 02 / REQ-F2.1)
            if (data.probability !== undefined && data.consequence !== undefined) {
                const { level, score } = this.riskAssessmentService.calculate(data.probability, data.consequence);
                payload.inherentRiskLevel = level;
                payload.probability = data.probability;
                payload.consequence = data.consequence;
                payload.metadata = {
                    erm_score: score,
                    calculation_method: 'AUTOMATIC_MATRIX_5X5',
                    calculated_at: new Date().toISOString()
                };
            }
            else if (data.inherentRiskLevel) {
                payload.inherentRiskLevel = data.inherentRiskLevel;
            }
            const ticket = await this.createTicket.execute(payload);
            res.status(201).json(ticket.toPrimitives());
        }
        catch (error) {
            return next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const tickets = await this.listTickets.execute();
            res.status(200).json(tickets.map(t => t.toPrimitives()));
        }
        catch (error) {
            return next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const ticket = await this.getTicket.execute(id);
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            return next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = updateStatusSchema.parse(req.body);
            const actorId = req.user?.id;
            const userRole = req.user?.role;
            if (!actorId || !userRole) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const ticket = await this.updateTicketStatus.execute({
                id: id,
                status: TicketStatus.fromString(data.status),
                actorId,
                userRole: userRole,
            });
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            return next(error);
        }
    };
    close = async (req, res, next) => {
        try {
            const { id } = req.params;
            const actorId = req.user?.id;
            const userRole = req.user?.role;
            if (!actorId || !userRole) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const ticket = await this.closeTicket.execute({
                id: id,
                actorId,
                userRole: userRole,
            });
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            return next(error);
        }
    };
    assign = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = assignTicketSchema.parse(req.body);
            const actorId = req.user?.id;
            const userRole = req.user?.role;
            if (!actorId || !userRole) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const ticket = await this.assignTicket.execute({
                id: id,
                techId: data.techId,
                actorId,
                userRole: userRole,
            });
            res.status(200).json(ticket.toPrimitives());
        }
        catch (error) {
            return next(error);
        }
    };
}
//# sourceMappingURL=TicketController.js.map