import { EscalationCron } from './infrastructure/adapters/EscalationCron.js';
import { TicketEscalationService } from './infrastructure/adapters/TicketEscalationService.js';
import { AuditLoggerAdapter } from './infrastructure/adapters/AuditLoggerAdapter.js';
import { McpPredictorAdapter } from './infrastructure/adapters/McpPredictorAdapter.js';

/**
 * Función de arranque para los servicios de infraestructura y soporte.
 * Integra el Circuit Breaker de IA y el Cron de Escalada de Riesgos.
 */
export async function bootstrapServices(dependencies: any) {
  const { ticketRepository, auditService, mcpBaseUrl } = dependencies;

  // 1. Inicializar Auditoría con encadenamiento SHA-256
  const auditLogger = new AuditLoggerAdapter(auditService);

  // 2. Configurar Predictor de IA con Circuit Breaker
  const predictor = new McpPredictorAdapter(mcpBaseUrl);
  console.info(`[Bootstrap] Predictor MCP configurado en: ${mcpBaseUrl}`);

  // 3. Configurar y arrancar Cron de Escalada (Regla de Negocio 02)
  const escalationService = new TicketEscalationService(ticketRepository, auditLogger);
  const escalationCron = new EscalationCron(escalationService);
  
  escalationCron.start();

  // Manejo de apagado gracioso
  process.on('SIGTERM', () => {
    escalationCron.stop();
    process.exit(0);
  });

  return {
    auditLogger,
    predictor,
    escalationCron
  };
}