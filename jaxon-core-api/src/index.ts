import cors from 'cors';
import express from 'express';

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', service: 'jaxon-core-api' });
  });

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
