import { Router } from 'express';
import { maintenanceController } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.use(authMiddleware);

router.post('/', requireRole(['ADMIN', 'MANAGER', 'TECH']), (req, res) => maintenanceController.create(req, res));
router.get('/', (req, res) => maintenanceController.list(req, res));
router.patch('/:id/status', requireRole(['ADMIN', 'MANAGER', 'TECH']), (req, res) => maintenanceController.updateStatus(req, res));

export default router;
