import type { Request, Response, NextFunction } from 'express';
import type { CreateTicket } from '../../application/tickets/CreateTicket.js';
import type { ListTickets } from '../../application/tickets/ListTickets.js';
import type { GetTicket } from '../../application/tickets/GetTicket.js';
import type { UpdateTicketStatus } from '../../application/tickets/UpdateTicketStatus.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
export declare class TicketController {
    private readonly createTicket;
    private readonly listTickets;
    private readonly getTicket;
    private readonly updateTicketStatus;
    constructor(createTicket: CreateTicket, listTickets: ListTickets, getTicket: GetTicket, updateTicketStatus: UpdateTicketStatus);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=TicketController.d.ts.map