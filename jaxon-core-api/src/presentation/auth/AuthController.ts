import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RegisterUser } from '../../application/users/RegisterUser.js';
import { AuthenticateUser } from '../../application/users/AuthenticateUser.js';
import { UserRole } from '../../domain/users/User.js';
import { randomUUID } from 'crypto';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.nativeEnum(UserRole).default(UserRole.TECH),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      
      await this.registerUser.execute({
        id: randomUUID(),
        email: data.email,
        passwordPlain: data.password,
        role: data.role,
        systemIp: ip,
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);

      const tokens = await this.authenticateUser.execute({
        email: data.email,
        passwordPlain: data.password,
      });

      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };
}
