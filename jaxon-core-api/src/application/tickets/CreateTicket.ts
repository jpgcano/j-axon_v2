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

import { v4 as uuid } from 'uuid';
import { Ticket, TicketRepository } from '../../domain/tickets/index.js';
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

export class CreateTicket {
  constructor(
    private ticketRepository: TicketRepository,
    private assetRepository: AssetRepository,
    private auditLogger: AuditLogger
  ) {}

  async execute(request: CreateTicketRequest): Promise<CreateTicketResponse> {
    // Step 1: Validate asset exists
    const asset = await this.assetRepository.findById(request.assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${request.assetId} not found`);
    }

    // Step 2: Create ticket aggregate
    const ticketId = uuid();
    const ticket = Ticket.create(
      ticketId,
      request.assetId,
      request.description,
      request.probability,
      request.consequence,
      request.createdBy
    );

    // Step 3: Persist ticket
    await this.ticketRepository.save(ticket);

    // Step 4: Register in audit log
    await this.auditLogger.logAction({
      entityTable: 'jaxon_tickets',
      entityId: ticketId,
      actionType: 'CREATE',
      payloadBefore: null,
      payloadAfter: ticket.toPrimitives(),
      actorId: request.createdBy,
      ipOrigin: '0.0.0.0/0', // TODO: get from request context
    });

    // Step 5: Return response
    const primitives = ticket.toPrimitives();
    const requiresApproval = ticket.getRiskLevel().requiresApproval();

    return {
      id: primitives.id,
      assetId: primitives.assetId,
      description: primitives.description,
      probability: primitives.probability,
      consequence: primitives.consequence,
      riskLevel: primitives.riskLevel,
      status: primitives.status,
      requiresApproval,
      createdAt: primitives.createdAt,
      message: requiresApproval
        ? `Ticket created with ${primitives.riskLevel} risk. Requires manager approval.`
        : `Ticket created with ${primitives.riskLevel} risk. Automatically approved.`,
    };
  }
}
