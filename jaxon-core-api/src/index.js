import express from 'express';
import cors from 'cors';
import { authRouter } from './presentation/auth/authRoutes.js';
import { assetRouter } from './presentation/assets/assetRoutes.js';
import { ticketRouter } from './presentation/tickets/ticketRoutes.js';
import { maintenanceRouter } from './presentation/maintenance/maintenanceRoutes.js';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', service: 'jaxon-core-api' });
});
// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/assets', assetRouter);
app.use('/api/tickets', ticketRouter);
// Global Error Handler
app.use(errorHandler);
app.listen(port, () => {
    console.log(`J-axon Core API running on port ${port}`);
});
//# sourceMappingURL=index.js.map