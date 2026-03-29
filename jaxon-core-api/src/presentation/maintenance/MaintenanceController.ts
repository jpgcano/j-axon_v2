import type { Request, Response } from 'express';
import { CreateMaintenance } from '../../application/maintenance/CreateMaintenance.js';
import { ListMaintenance } from '../../application/maintenance/ListMaintenance.js';
import { UpdateMaintenanceStatus } from '../../application/maintenance/UpdateMaintenanceStatus.js';

import { matchError } from 'better-result';

export class MaintenanceController {
  constructor(
    private readonly createMaintenance: CreateMaintenance,
    private readonly listMaintenance: ListMaintenance,
    private readonly updateMaintenanceStatus: UpdateMaintenanceStatus
  ) {}

  public async create(req: Request, res: Response): Promise<void> {
    const result = await this.createMaintenance.execute({
      ...req.body,
      createdBy: (req as any).user.id,
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

  public async list(req: Request, res: Response): Promise<void> {
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

  public async updateStatus(req: Request, res: Response): Promise<void> {
    const result = await this.updateMaintenanceStatus.execute({
      id: req.params.id as string,
      status: req.body.status,
      actorId: (req as any).user.id,
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
