import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import type { McpClient, AIResponse } from '../../infrastructure/external/McpClient.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export interface PredictMaintenanceRequest {
  assetId: string;
  ticketId?: string;
}

import { Result } from 'better-result';
import { NotFoundError, InternalError } from '../../domain/core/errors.js';

export class PredictMaintenance {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly ticketRepository: TicketRepository,
    private readonly aiClient: McpClient
  ) {}

  public async execute(request: PredictMaintenanceRequest): Promise<Result<AIResponse, NotFoundError | InternalError>> {
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
        if (error instanceof NotFoundError) return error;
        return new InternalError({ message: 'AI Prediction failed', cause: error });
      },
    });
  }
}
