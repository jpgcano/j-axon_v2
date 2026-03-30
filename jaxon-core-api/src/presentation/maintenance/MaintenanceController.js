import { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';
import { matchError } from 'better-result';
import { z } from 'zod';
const createMaintenanceSchema = z.object({
    assetId: z.string().uuid(),
    ticketId: z.string().uuid().nullable().optional(),
    type: z.string(),
    description: z.string().min(3),
    scheduledDate: z.coerce.date(),
    assignedTechId: z.string().uuid().nullable().optional(),
}).strict();
const updateMaintenanceStatusSchema = z.object({
    status: z.string(),
}).strict();
export class MaintenanceController {
    createMaintenance;
    listMaintenance;
    updateMaintenanceStatus;
    constructor(createMaintenance, listMaintenance, updateMaintenanceStatus) {
        this.createMaintenance = createMaintenance;
        this.listMaintenance = listMaintenance;
        this.updateMaintenanceStatus = updateMaintenanceStatus;
    }
    async create(req, res) {
        const data = createMaintenanceSchema.parse(req.body);
        const result = await this.createMaintenance.execute({
            ...data,
            createdBy: req.user.id,
        });
        result.match({
            ok: (maintenance) => res.status(201).json(maintenance.toPrimitives()),
            err: (error) => {
                return matchError(error, {
                    InternalError: (err) => res.status(500).json({ error: err.message }),
                });
            },
        });
    }
    async list(req, res) {
        const result = await this.listMaintenance.execute();
        result.match({
            ok: (maintenances) => res.json(maintenances.map((m) => m.toPrimitives())),
            err: (error) => {
                return matchError(error, {
                    InternalError: (err) => res.status(500).json({ error: err.message }),
                });
            },
        });
    }
    async updateStatus(req, res) {
        const data = updateMaintenanceStatusSchema.parse(req.body);
        const result = await this.updateMaintenanceStatus.execute({
            id: req.params.id,
            status: data.status,
            actorId: req.user.id,
        });
        result.match({
            ok: (maintenance) => res.json(maintenance.toPrimitives()),
            err: (error) => {
                return matchError(error, {
                    NotFoundError: (err) => res.status(404).json({ error: err.message }),
                    InternalError: (err) => res.status(500).json({ error: err.message }),
                });
            },
        });
    }
}
//# sourceMappingURL=MaintenanceController.js.map