import { EscalationCron } from './infrastructure/adapters/EscalationCron.js';
import { AuditLoggerAdapter } from './infrastructure/adapters/AuditLoggerAdapter.js';
import { McpPredictorAdapter } from './infrastructure/adapters/McpPredictorAdapter.js';
/**
 * Función de arranque para los servicios de infraestructura y soporte.
 * Integra el Circuit Breaker de IA y el Cron de Escalada de Riesgos.
 */
export declare function bootstrapServices(dependencies: any): Promise<{
    auditLogger: AuditLoggerAdapter;
    predictor: McpPredictorAdapter;
    escalationCron: EscalationCron;
}>;
//# sourceMappingURL=bootstrap.d.ts.map