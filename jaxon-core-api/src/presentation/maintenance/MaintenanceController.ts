import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import type { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import type { GetMaintenance } from '../../application/maintenance/GetMaintenance.js';
import type { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';
import { MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

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
  constructor(
    private readonly createMaintenance: CreateMaintenance,
    private readonly listMaintenance: ListMaintenance,
    private readonly getMaintenance: GetMaintenance,
    private readonly updateMaintenanceStatus: UpdateMaintenanceStatus,
  ) {}

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createMaintenanceSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }
      
      const payload: any = {
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
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await this.listMaintenance.execute();
      res.status(200).json(list.map(m => m.toPrimitives()));
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const maintenance = await this.getMaintenance.execute(id as string);
      res.status(200).json(maintenance.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = updateStatusSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      const maintenance = await this.updateMaintenanceStatus.execute({
        id: id as string,
        status: data.status,
        actorId,
      });

      res.status(200).json(maintenance.toPrimitives());
    } catch (error) {
      next(error);
    }
  };
}
