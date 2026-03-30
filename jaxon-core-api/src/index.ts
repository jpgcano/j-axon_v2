import express from 'express';
import cors from 'cors';
import { authRouter } from './presentation/auth/authRoutes.js';
import { assetRouter } from './presentation/assets/assetRoutes.js';
import { ticketRouter } from './presentation/tickets/ticketRoutes.js';
import maintenanceRouter from './presentation/maintenance/maintenanceRoutes.js';
import { errorHandler } from './presentation/middlewares/errorHandler.js';

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', service: 'jaxon-core-api' });
  });

  // Mount Routes
  app.use('/api/auth', authRouter);
  app.use('/api/assets', assetRouter);
  app.use('/api/tickets', ticketRouter);
  app.use('/api/maintenance', maintenanceRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export const startServer = (port = process.env.PORT || 3001) => {
  const app = createApp();

  return app.listen(port, () => {
    console.log(`J-axon Core API running on port ${port}`);
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
