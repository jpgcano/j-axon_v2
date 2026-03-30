import { z } from 'zod';
const deactivateSchema = z.object({
    reason: z.string().min(3).optional(),
}).strict();
export class UserController {
    deactivateUser;
    activateUser;
    constructor(deactivateUser, activateUser) {
        this.deactivateUser = deactivateUser;
        this.activateUser = activateUser;
    }
    deactivate = async (req, res, next) => {
        try {
            const { id } = req.params;
            deactivateSchema.parse(req.body ?? {});
            const actorId = req.user?.id;
            const userRole = req.user?.role;
            if (!actorId || !userRole) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            await this.deactivateUser.execute({
                id: id,
                actorId,
                userRole: userRole,
            });
            res.status(200).json({ status: 'deactivated', id });
        }
        catch (error) {
            next(error);
        }
    };
    activate = async (req, res, next) => {
        try {
            const { id } = req.params;
            deactivateSchema.parse(req.body ?? {});
            const actorId = req.user?.id;
            const userRole = req.user?.role;
            if (!actorId || !userRole) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            await this.activateUser.execute({
                id: id,
                actorId,
                userRole: userRole,
            });
            res.status(200).json({ status: 'activated', id });
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=UserController.js.map