import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { CreateAsset } from '../../application/assets/CreateAsset.js';
import type { ListAssets } from '../../application/assets/ListAssets.js';
import type { GetAsset } from '../../application/assets/GetAsset.js';
import type { UpdateAsset } from '../../application/assets/UpdateAsset.js';
import { AssetStatus } from '../../domain/assets/Asset.js';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

const updateAssetSchema = z.object({
  description: z.string().min(3).optional(),
  category: z.string().min(2).optional(),
  status: z.nativeEnum(AssetStatus).optional(),
});

export class AssetController {
  constructor(
    private readonly createAsset: CreateAsset,
    private readonly listAssets: ListAssets,
    private readonly getAsset: GetAsset,
    private readonly updateAsset: UpdateAsset,
  ) {}

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = createAssetSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }
      
      const payload: any = {
        description: data.description,
        category: data.category,
        actorId,
      };
      if (data.status) payload.status = data.status;

      const asset = await this.createAsset.execute(payload);

      res.status(201).json(asset.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assets = await this.listAssets.execute();
      res.status(200).json(assets.map(a => a.toPrimitives()));
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const asset = await this.getAsset.execute(id as string);
      res.status(200).json(asset.toPrimitives());
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = updateAssetSchema.parse(req.body);
      const actorId = req.user?.id;

      if (!actorId) {
        res.status(401).json({ error: 'Unauthorized user context missing' });
        return;
      }

      const asset = await this.updateAsset.execute({
        id: id as string,
        ...data,
        actorId,
      });

      res.status(200).json(asset.toPrimitives());
    } catch (error) {
      next(error);
    }
  };
}
