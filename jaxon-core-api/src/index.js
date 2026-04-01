import express from 'express';
import cors from 'cors';
import { authRouter } from './presentation/auth/authRoutes.js';
import { assetRouter } from './presentation/assets/assetRoutes.js';
import { ticketRouter } from './presentation/tickets/ticketRoutes.js';
import maintenanceRouter from './presentation/maintenance/maintenanceRoutes.js';
import { userRouter } from './presentation/users/userRoutes.js';
import aiRouter from './presentation/ai/aiRoutes.js';
import { getAuditObservability } from './infrastructure/observability/AuditMonitor.js';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
import { requestContextMiddleware } from './presentation/middlewares/requestContext.js';
import { auditMiddleware } from './presentation/middlewares/auditMiddleware.js';
import { apiLimiter } from './presentation/middlewares/rateLimiters.js';
import { bootstrapServices } from './bootstrap.js';
export const createApp = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(requestContextMiddleware);
    app.use(auditMiddleware);
    app.use(apiLimiter);
    app.get('/api/v1/health', (_req, res) => {
        const base = { status: 'ok', service: 'jaxon-core-api' };
        if (process.env.AUDIT_HEALTH_DETAIL === 'on') {
            res.json({ ...base, audit: getAuditObservability() });
            return;
        }
        res.json(base);
    });
    // Mount Routes
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/assets', assetRouter);
    app.use('/api/v1/tickets', ticketRouter);
    app.use('/api/v1/maintenance', maintenanceRouter);
    app.use('/api/v1/ai/maintenance', aiRouter);
    // Global Error Handler
    app.use(errorHandler);
    return app;
};
export const startServer = async (port = process.env.PORT || 3001) => {
    const app = createApp();
    // Tarea: Inyección de dependencias reales para servicios de fondo (Regla 01 y 02)
    // Aplicamos fail-fast: si el contenedor falla, el servidor no arranca para proteger la integridad.
    const container = await import('./infrastructure/di/container.js');
    // Inicializar servicios de soporte (IA, Cron, Auditoría)
    await bootstrapServices({
        ticketRepository: container.ticketRepository,
        auditService: container.auditRepository,
        mcpBaseUrl: process.env.MCP_SIDECAR_URL || 'http://localhost:9000'
    }).catch(err => {
        console.error('Error starting background services:', err);
    });
    return app.listen(port, () => {
        console.log(`J-axon Core API running on port ${port}`);
    });
};
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer();
}
//# sourceMappingURL=index.js.map