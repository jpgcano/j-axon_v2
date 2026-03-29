import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { CreateTicket } from '../../application/tickets/CreateTicket.js';
import type { ListTickets } from '../../application/tickets/ListTickets.js';
import type { GetTicket } from '../../application/tickets/GetTicket.js';
import type { UpdateTicketStatus } from '../../application/tickets/UpdateTicketStatus.js';
import { TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const createTicketSchema = z.object({
  issueDescription: z.string().min(5),
  assetId: z.string().uuid(),
  inherentRiskLevel: z.nativeEnum(RiskLevel).optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});

export class TicketController {
  constructor(
    private readonly createTicket: CreateTicket,
    private readonly listTickets: ListTickets,
    private readonly getTicket: GetTicket,
    private readonly updateTicketStatus: UpdateTicketStatus,
  ) {}

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createTicketSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }
      
      const payload: any = {
        issueDescription: data.issueDescription,
        assetId: data.assetId,
        actorId,
      };
      if (data.inherentRiskLevel) payload.inherentRiskLevel = data.inherentRiskLevel;

      const ticket = await this.createTicket.execute(payload);

      res.status(201).json(ticket.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tickets = await this.listTickets.execute();
      res.status(200).json(tickets.map(t => t.toPrimitives()));
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const ticket = await this.getTicket.execute(id as string);
      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = updateStatusSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      const ticket = await this.updateTicketStatus.execute({
        id: id as string,
        status: data.status,
        actorId,
      });

      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      next(error);
    }
  };
}
