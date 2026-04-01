/**
 * Middleware: requireTicketApprover
 *
 * RBAC enforcement for ticket operations
 * - Blocks TECH/AUDITOR from modifying HIGH/EXTREME risk tickets
 * - Only MANAGER/ADMIN/CRO can approve or modify HIGH/EXTREME tickets
 *
 * Use: Apply to endpoints that modify tickets
 */
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './authMiddleware.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export declare const requireTicketApprover: (ticketRepository: TicketRepository) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=requireTicketApprover.d.ts.map