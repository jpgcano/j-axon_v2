import type { Request, Response } from 'express';
import type { PredictMaintenance } from '../../application/ai/PredictMaintenance.js';
export declare class AIController {
    private readonly predictMaintenance;
    constructor(predictMaintenance: PredictMaintenance);
    predict(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AIController.d.ts.map