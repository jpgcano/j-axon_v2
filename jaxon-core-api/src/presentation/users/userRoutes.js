import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userController } from '../../infrastructure/di/container.js';
import { requireRole } from '../middlewares/requireRole.js';
const userRouter = Router();
userRouter.use(authMiddleware);
userRouter.patch('/:id/deactivate', requireRole(['ADMIN', 'MANAGER']), userController.deactivate);
userRouter.patch('/:id/activate', requireRole(['ADMIN', 'MANAGER']), userController.activate);
export { userRouter };
//# sourceMappingURL=userRoutes.js.map