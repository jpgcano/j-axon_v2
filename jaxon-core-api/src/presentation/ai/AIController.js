import { matchError } from 'better-result';
export class AIController {
    predictMaintenance;
    constructor(predictMaintenance) {
        this.predictMaintenance = predictMaintenance;
    }
    async predict(req, res) {
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
//# sourceMappingURL=AIController.js.map