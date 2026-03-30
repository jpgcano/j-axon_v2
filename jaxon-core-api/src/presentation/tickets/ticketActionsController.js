import { Request, Response } from 'express';
import { ApplyAiSuggestionService } from '../../ApplyAiSuggestionService.js';
/**
 * Controlador para acciones específicas de Tickets
 * Cumple con la Regla de Negocio 03 (Validación Humana de IA)
 */
export class TicketActionsController {
    applyAiSuggestionService;
    constructor(applyAiSuggestionService) {
        this.applyAiSuggestionService = applyAiSuggestionService;
    }
    async applySuggestion(req, res) {
        const { id } = req.params;
        const { recommendation } = req.body;
        // Se obtiene del JWT decodificado por el authMiddleware
        const actorId = req.user?.id;
        const ipOrigin = req.ip || '127.0.0.1';
        try {
            await this.applyAiSuggestionService.execute(id, recommendation, actorId, ipOrigin);
            return res.status(200).json({
                success: true,
                message: 'Sugerencia de IA aplicada y registrada en auditoría.'
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}
//# sourceMappingURL=ticketActionsController.js.map