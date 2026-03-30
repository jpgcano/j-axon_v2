import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import type { DeactivateUser } from '../../application/users/DeactivateUser.js';
import type { ActivateUser } from '../../application/users/ActivateUser.js';
export declare class UserController {
    private readonly deactivateUser;
    private readonly activateUser;
    constructor(deactivateUser: DeactivateUser, activateUser: ActivateUser);
    deactivate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    activate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map