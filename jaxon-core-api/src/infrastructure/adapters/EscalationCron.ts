import { TicketEscalationService } from './TicketEscalationService.js';

/**
 * EscalationCron
 * 
 * Orquestador de fondo que ejecuta la lógica de escalada automática de tickets
 * cumpliendo con la Regla de Negocio 02 (SLA de 4 horas).
 */
export class EscalationCron {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly CHECK_INTERVAL_MS = 30 * 60 * 1000; // Ejecución cada 30 minutos

  constructor(private escalationService: TicketEscalationService) {}

  start(): void {
    if (this.timer) return;

    console.info('[EscalationCron] Servicio de escalada automática iniciado.');
    
    this.timer = setInterval(async () => {
      if (this.isRunning) return;
      
      try {
        this.isRunning = true;
        const escalatedCount = await this.escalationService.processPendingEscalations();
        if (escalatedCount > 0) {
          console.info(`[EscalationCron] Se escalaron ${escalatedCount} tickets al CRO exitosamente.`);
        }
      } catch (error) {
        console.error(`[EscalationCron] Error crítico en el ciclo de escalada: ${(error as Error).message}`);
      } finally {
        this.isRunning = false;
      }
    }, this.CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    console.info('[EscalationCron] Servicio de escalada detenido.');
  }
}