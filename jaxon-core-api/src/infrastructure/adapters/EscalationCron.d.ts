import { TicketEscalationService } from './TicketEscalationService.js';
/**
 * EscalationCron
 *
 * Orquestador de fondo que ejecuta la lógica de escalada automática de tickets
 * cumpliendo con la Regla de Negocio 02 (SLA de 4 horas).
 */
export declare class EscalationCron {
    private escalationService;
    private timer;
    private isRunning;
    private readonly CHECK_INTERVAL_MS;
    constructor(escalationService: TicketEscalationService);
    start(): void;
    stop(): void;
}
//# sourceMappingURL=EscalationCron.d.ts.map