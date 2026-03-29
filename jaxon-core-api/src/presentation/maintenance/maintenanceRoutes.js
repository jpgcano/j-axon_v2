import { Router } from 'express';
import { maintenanceController } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(authMiddleware);
router.post('/', (req, res) => maintenanceController.create(req, res));
router.get('/', (req, res) => maintenanceController.list(req, res));
router.patch('/:id/status', (req, res) => maintenanceController.updateStatus(req, res));
export default router;
//# sourceMappingURL=maintenanceRoutes.js.map