import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { registerUser, authenticateUser } from '../../infrastructure/di/container.js';
export const authRouter = Router();
const authController = new AuthController(registerUser, authenticateUser);
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
//# sourceMappingURL=authRoutes.js.map