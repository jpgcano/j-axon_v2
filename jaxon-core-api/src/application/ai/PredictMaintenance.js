import { NotFoundException } from '../../domain/core/exceptions.js';
import { Result } from 'better-result';
import { NotFoundError, InternalError } from '../../domain/core/errors.js';
export class PredictMaintenance {
    assetRepository;
    ticketRepository;
    aiClient;
    constructor(assetRepository, ticketRepository, aiClient) {
        this.assetRepository = assetRepository;
        this.ticketRepository = ticketRepository;
        this.aiClient = aiClient;
    }
    async execute(request) {
        return Result.tryPromise({
            try: async () => {
                const asset = await this.assetRepository.findById(request.assetId);
                if (!asset) {
                    throw new NotFoundError({ entity: 'Asset', id: request.assetId });
                }
                let ticketContext = null;
                if (request.ticketId) {
                    const ticket = await this.ticketRepository.findById(request.ticketId);
                    if (ticket) {
                        ticketContext = ticket.toPrimitives();
                    }
                }
                // Orchestrate payload for AI
                const payload = {
                    asset: asset.toPrimitives(),
                    ticket: ticketContext,
                    historyLength: 10,
                };
                return this.aiClient.getPrediction(payload);
            },
            catch: (error) => {
                if (error instanceof NotFoundError)
                    return error;
                return new InternalError({ message: 'AI Prediction failed', cause: error });
            },
        });
    }
}
//# sourceMappingURL=PredictMaintenance.js.map