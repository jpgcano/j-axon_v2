import { Request, Response } from 'express';
import { ApplyAiSuggestionService } from '../../ApplyAiSuggestionService.js';
/**
 * Controlador para acciones específicas de Tickets
 * Cumple con la Regla de Negocio 03 (Validación Humana de IA)
 */
export declare class TicketActionsController {
    private applyAiSuggestionService;
    constructor(applyAiSuggestionService: ApplyAiSuggestionService);
    applySuggestion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ticketActionsController.d.ts.map