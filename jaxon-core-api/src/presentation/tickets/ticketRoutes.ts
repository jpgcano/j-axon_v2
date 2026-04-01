import { Router } from 'express';
import { TicketController } from './TicketController.js';
import { createTicket, listTickets, getTicket, updateTicketStatus, closeTicket, assignTicket, ticketRepository, auditLogger } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireTicketApprover } from '../middlewares/requireTicketApprover.js';
import { requireRole } from '../middlewares/requireRole.js';
import { TicketActionsController } from './ticketActionsController.js';
import { ApplyAiSuggestionService } from '../../ApplyAiSuggestionService.js';

export const ticketRouter = Router();

// Protect all ticket routes with authentication
ticketRouter.use(authMiddleware);

const ticketController = new TicketController(
  createTicket,
  listTickets,
  getTicket,
  updateTicketStatus,
  closeTicket,
  assignTicket
);

const ticketActionsController = new TicketActionsController(
  new ApplyAiSuggestionService(ticketRepository, auditLogger)
);

ticketRouter.post('/', requireRole(['ADMIN', 'MANAGER', 'TECH']), ticketController.create);
ticketRouter.get('/', ticketController.list);
ticketRouter.get('/:id', ticketController.getById);
ticketRouter.patch('/:id/status', requireTicketApprover(ticketRepository), ticketController.updateStatus);
ticketRouter.patch('/:id/apply-suggestion', requireRole(['TECH', 'MANAGER', 'ADMIN']), ticketActionsController.applySuggestion);
ticketRouter.patch('/:id/assign', requireRole(['ADMIN', 'MANAGER', 'TECH']), ticketController.assign);
ticketRouter.delete('/:id', requireRole(['ADMIN', 'MANAGER']), ticketController.close);
