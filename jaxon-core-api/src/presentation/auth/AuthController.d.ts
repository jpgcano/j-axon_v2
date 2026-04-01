import type { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../application/users/RegisterUser.js';
import { AuthenticateUser } from '../../application/users/AuthenticateUser.js';
export declare class AuthController {
    private readonly registerUser;
    private readonly authenticateUser;
    constructor(registerUser: RegisterUser, authenticateUser: AuthenticateUser);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map