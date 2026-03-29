import { z } from 'zod';
import { MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
const createMaintenanceSchema = z.object({
    assetId: z.string().uuid(),
    ticketId: z.string().uuid().optional(),
    type: z.nativeEnum(MaintenanceType),
    description: z.string().min(5),
    scheduledDate: z.string().datetime().transform(str => new Date(str)),
});
const updateStatusSchema = z.object({
    status: z.nativeEnum(MaintenanceStatus),
});
export class MaintenanceController {
    createMaintenance;
    listMaintenance;
    getMaintenance;
    updateMaintenanceStatus;
    constructor(createMaintenance, listMaintenance, getMaintenance, updateMaintenanceStatus) {
        this.createMaintenance = createMaintenance;
        this.listMaintenance = listMaintenance;
        this.getMaintenance = getMaintenance;
        this.updateMaintenanceStatus = updateMaintenanceStatus;
    }
    create = async (req, res, next) => {
        try {
            const data = createMaintenanceSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const payload = {
                assetId: data.assetId,
                type: data.type,
                description: data.description,
                scheduledDate: data.scheduledDate,
                actorId,
            };
            if (data.ticketId) {
                payload.ticketId = data.ticketId;
            }
            const maintenance = await this.createMaintenance.execute(payload);
            res.status(201).json(maintenance.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const list = await this.listMaintenance.execute();
            res.status(200).json(list.map(m => m.toPrimitives()));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const maintenance = await this.getMaintenance.execute(id);
            res.status(200).json(maintenance.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = updateStatusSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const maintenance = await this.updateMaintenanceStatus.execute({
                id: id,
                status: data.status,
                actorId,
            });
            res.status(200).json(maintenance.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=MaintenanceController.js.map