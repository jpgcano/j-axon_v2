import { TicketEscalationService } from './TicketEscalationService.js';
/**
 * EscalationCron
 *
 * Orquestador de fondo que ejecuta la lógica de escalada automática de tickets
 * cumpliendo con la Regla de Negocio 02 (SLA de 4 horas).
 */
export class EscalationCron {
    escalationService;
    timer = null;
    isRunning = false;
    CHECK_INTERVAL_MS = 30 * 60 * 1000; // Ejecución cada 30 minutos
    constructor(escalationService) {
        this.escalationService = escalationService;
    }
    start() {
        if (this.timer)
            return;
        console.info('[EscalationCron] Servicio de escalada automática iniciado.');
        this.timer = setInterval(async () => {
            if (this.isRunning)
                return;
            try {
                this.isRunning = true;
                const escalatedCount = await this.escalationService.processPendingEscalations();
                if (escalatedCount > 0) {
                    console.info(`[EscalationCron] Se escalaron ${escalatedCount} tickets al CRO exitosamente.`);
                }
            }
            catch (error) {
                console.error(`[EscalationCron] Error crítico en el ciclo de escalada: ${error.message}`);
            }
            finally {
                this.isRunning = false;
            }
        }, this.CHECK_INTERVAL_MS);
    }
    stop() {
        if (this.timer)
            clearInterval(this.timer);
        console.info('[EscalationCron] Servicio de escalada detenido.');
    }
}
//# sourceMappingURL=EscalationCron.js.map