import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { registerUser, authenticateUser } from '../../infrastructure/di/container.js';
import { authLimiter } from '../middlewares/rateLimiters.js';

export const authRouter = Router();
authRouter.use(authLimiter);

const authController = new AuthController(registerUser, authenticateUser);

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
