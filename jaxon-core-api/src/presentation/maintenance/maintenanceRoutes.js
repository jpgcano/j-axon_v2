import { Router } from 'express';
import { MaintenanceController } from './MaintenanceController.js';
import { createMaintenance, listMaintenance, getMaintenance, updateMaintenanceStatus } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
export const maintenanceRouter = Router();
maintenanceRouter.use(authMiddleware);
const maintenanceController = new MaintenanceController(createMaintenance, listMaintenance, getMaintenance, updateMaintenanceStatus);
maintenanceRouter.post('/', maintenanceController.create);
maintenanceRouter.get('/', maintenanceController.list);
maintenanceRouter.get('/:id', maintenanceController.getById);
maintenanceRouter.patch('/:id/status', maintenanceController.updateStatus);
//# sourceMappingURL=maintenanceRoutes.js.map