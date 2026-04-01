/**
 * Middleware: requireTicketApprover
 *
 * RBAC enforcement for ticket operations
 * - Blocks TECH/AUDITOR from modifying HIGH/EXTREME risk tickets
 * - Only MANAGER/ADMIN/CRO can approve or modify HIGH/EXTREME tickets
 *
 * Use: Apply to endpoints that modify tickets
 */
import { NotFoundException } from '../../domain/core/exceptions.js';
export const requireTicketApprover = (ticketRepository) => {
    return async (req, res, next) => {
        try {
            const ticketId = req.params.id;
            const userRole = req.user?.role;
            if (!ticketId || !userRole) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            // Load ticket to check risk level
            const ticket = await ticketRepository.findById(ticketId);
            if (!ticket) {
                res.status(404).json({ error: 'Ticket not found' });
                return;
            }
            // Get risk level from ticket
            const primitives = ticket.toPrimitives();
            const riskLevel = primitives.riskLevel;
            // RBAC: TECH/AUDITOR cannot modify HIGH/EXTREME tickets
            if ((userRole === 'TECH' || userRole === 'AUDITOR') && (riskLevel === 'HIGH' || riskLevel === 'EXTREME')) {
                res.status(403).json({
                    error: 'Forbidden: TECH/AUDITOR cannot modify HIGH/EXTREME risk tickets. Requires MANAGER approval.',
                });
                return;
            }
            // Pass through if authorized
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=requireTicketApprover.js.map