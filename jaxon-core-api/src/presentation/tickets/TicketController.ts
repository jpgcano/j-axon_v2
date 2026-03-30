import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { CreateTicket } from '../../application/tickets/CreateTicket.js';
import type { ListTickets } from '../../application/tickets/ListTickets.js';
import type { GetTicket } from '../../application/tickets/GetTicket.js';
import type { UpdateTicketStatus } from '../../application/tickets/UpdateTicketStatus.js';
import type { CloseTicket } from '../../application/tickets/CloseTicket.js';
import type { AssignTicket } from '../../application/tickets/AssignTicket.js';
import { TicketStatus, TicketStatusEnum, RiskLevel } from '../../domain/tickets/index.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
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
  constructor(
    private readonly createTicket: CreateTicket,
    private readonly listTickets: ListTickets,
    private readonly getTicket: GetTicket,
    private readonly updateTicketStatus: UpdateTicketStatus,
    private readonly closeTicket: CloseTicket,
    private readonly assignTicket: AssignTicket,
    private readonly riskAssessmentService: RiskAssessmentService = new RiskAssessmentService()
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
      } else if (data.inherentRiskLevel) {
        payload.inherentRiskLevel = data.inherentRiskLevel;
      }

      const ticket = await this.createTicket.execute(payload);

      res.status(201).json(ticket.toPrimitives());
    } catch (error) {
      return next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tickets = await this.listTickets.execute();
      res.status(200).json(tickets.map(t => t.toPrimitives()));
    } catch (error) {
      return next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const ticket = await this.getTicket.execute(id as string);
      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      return next(error);
    }
  };

  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
        id: id as string,
        status: TicketStatus.fromString(data.status),
        actorId,
        userRole: userRole as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR',
      });

      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      return next(error);
    }
  };

  public close = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const actorId = req.user?.id;
      const userRole = req.user?.role;

      if (!actorId || !userRole) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      const ticket = await this.closeTicket.execute({
        id: id as string,
        actorId,
        userRole: userRole as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR',
      });

      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      return next(error);
    }
  };

  public assign = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
        id: id as string,
        techId: data.techId,
        actorId,
        userRole: userRole as 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR',
      });

      res.status(200).json(ticket.toPrimitives());
    } catch (error) {
      return next(error);
    }
  };
}
