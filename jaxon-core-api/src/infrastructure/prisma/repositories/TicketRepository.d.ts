/**
 * Ticket Repository Implementation
 * Persists Ticket aggregate to PostgreSQL via Prisma ORM
 *
 * Responsibilities:
 * - Map Ticket domain objects to/from database
 * - Execute queries for ticket lookups
 * - Enforce data consistency via transactions
 */
import { PrismaClient } from '../../../../generated/prisma/client.js';
import { Ticket, TicketRepository } from '../../../domain/tickets/index.js';
export declare class PrismaTicketRepository implements TicketRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    save(ticket: Ticket): Promise<void>;
    findById(id: string): Promise<Ticket | null>;
    findByAssetId(assetId: string): Promise<Ticket[]>;
    findByStatus(status: string): Promise<Ticket[]>;
    findPendingApprovals(): Promise<Ticket[]>;
    findAll(limit?: number, offset?: number): Promise<Ticket[]>;
    findByAssignedTech(techId: string): Promise<Ticket[]>;
    count(): Promise<number>;
    delete(id: string): Promise<void>;
    /**
     * Convert Prisma record to Ticket domain entity
     */
    private toDomain;
    /**
     * Calculate SHA256 integrity hash for audit
     */
    private calculateHash;
}
//# sourceMappingURL=TicketRepository.d.ts.map