import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
import type { McpClient, AIResponse } from '../../infrastructure/external/McpClient.js';
export interface PredictMaintenanceRequest {
    assetId: string;
    ticketId?: string;
}
import { Result } from 'better-result';
import { NotFoundError, InternalError } from '../../domain/core/errors.js';
export declare class PredictMaintenance {
    private readonly assetRepository;
    private readonly ticketRepository;
    private readonly aiClient;
    constructor(assetRepository: AssetRepository, ticketRepository: TicketRepository, aiClient: McpClient);
    execute(request: PredictMaintenanceRequest): Promise<Result<AIResponse, NotFoundError | InternalError>>;
}
//# sourceMappingURL=PredictMaintenance.d.ts.map