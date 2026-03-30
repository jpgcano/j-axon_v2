import { Router } from 'express';
import { aiController } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.post('/predict', authMiddleware, requireRole(['ADMIN', 'MANAGER']), (req, res) => aiController.predict(req, res));

export default router;
