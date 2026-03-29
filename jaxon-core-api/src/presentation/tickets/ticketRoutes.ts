import { Router } from 'express';
import { TicketController } from './TicketController.js';
import { createTicket, listTickets, getTicket, updateTicketStatus } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const ticketRouter = Router();

// Protect all ticket routes with authentication
ticketRouter.use(authMiddleware);

const ticketController = new TicketController(createTicket, listTickets, getTicket, updateTicketStatus);

ticketRouter.post('/', ticketController.create);
ticketRouter.get('/', ticketController.list);
ticketRouter.get('/:id', ticketController.getById);
ticketRouter.patch('/:id/status', ticketController.updateStatus);
