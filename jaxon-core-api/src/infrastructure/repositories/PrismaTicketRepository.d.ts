import type { PrismaClient } from '../../../generated/prisma/client.js';
import { Ticket, TicketStatus } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export declare class PrismaTicketRepository implements TicketRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private generateIntegrityHash;
    save(ticket: Ticket): Promise<void>;
    findById(id: string): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
    findByAssetId(assetId: string): Promise<Ticket[]>;
    findByStatus(status: TicketStatus): Promise<Ticket[]>;
    findByAssignedTech(techId: string): Promise<Ticket[]>;
}
//# sourceMappingURL=PrismaTicketRepository.d.ts.map