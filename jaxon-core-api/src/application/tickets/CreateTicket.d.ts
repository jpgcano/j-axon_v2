/**
 * CreateTicket Use Case
 *
 * Application service that creates a new ticket with automatic risk calculation
 *
 * Input: Ticket creation request (assetId, description, probability, consequence, creator)
 * Output: Created ticket details with calculated risk level and initial status
 *
 * Business Rules:
 * 1. Asset must exist
 * 2. Probability and consequence must be 1-5
 * 3. ERM: Calculate risk = P × C
 * 4. If HIGH/EXTREME → status = PENDING_APPROVAL (requires manager approval)
 * 5. If LOW/MEDIUM → status = APPROVED (ready for work)
 * 6. Register creation in audit logs
 */
import { TicketRepository } from '../../domain/tickets/index.js';
import { AssetRepository } from '../../domain/assets/index.js';
import { AuditLogger } from '../audit/AuditLogger.js';
export interface CreateTicketRequest {
    assetId: string;
    description: string;
    probability: number;
    consequence: number;
    createdBy: string;
}
export interface CreateTicketResponse {
    id: string;
    assetId: string;
    description: string;
    probability: number;
    consequence: number;
    riskLevel: string;
    status: string;
    requiresApproval: boolean;
    createdAt: Date;
    message: string;
}
export declare class CreateTicket {
    private ticketRepository;
    private assetRepository;
    private auditLogger;
    constructor(ticketRepository: TicketRepository, assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: CreateTicketRequest): Promise<CreateTicketResponse>;
}
//# sourceMappingURL=CreateTicket.d.ts.map