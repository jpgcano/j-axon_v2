import { Router } from 'express';
import { aiController } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/predict', authMiddleware, (req, res) => aiController.predict(req, res));

export default router;
