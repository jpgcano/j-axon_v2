import type { Request, Response } from 'express';
import type { PredictMaintenance } from '../../application/ai/PredictMaintenance.js';

import { matchError } from '../../domain/core/Result.js';

export class AIController {
  constructor(private readonly predictMaintenance: PredictMaintenance) {}

  public async predict(req: Request, res: Response): Promise<void> {
    const { assetId, ticketId } = req.body;
    const result = await this.predictMaintenance.execute({ assetId, ticketId });

    result.match({
      ok: (prediction) => res.status(200).json(prediction),
      err: (error) => {
        return matchError(error, {
          NotFoundError: (err) => res.status(404).json({ error: err.message }),
          InternalError: (err) => res.status(500).json({ error: err.message }),
        });
      },
    });
  }
}
