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
import { Ticket, TicketPrimitives, TicketRepository } from '../../../domain/tickets/index.js';
import { TicketStatus } from '../../../domain/tickets/value-objects/TicketStatus.js';
import { getRequestContext } from '../../context/RequestContext.js';
export class PrismaTicketRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(ticket) {
        const primitives = ticket.toPrimitives();
        await this.prisma.jaxonTicket.upsert({
            where: { id: primitives.id },
            create: {
                id: primitives.id,
                asset_id: primitives.assetId,
                issue_description: primitives.description,
                probability: primitives.probability,
                consequence: primitives.consequence,
                inherent_risk_level: primitives.riskLevel,
                status: primitives.status,
                assigned_tech_id: primitives.assignedTechId,
                approved_by_id: primitives.approvedById,
                created_by: primitives.createdBy,
                updated_by: primitives.updatedBy,
                created_at: primitives.createdAt,
                updated_at: primitives.updatedAt,
                ip_origin: getRequestContext().ipOrigin || '0.0.0.0',
                integrity_hash: this.calculateHash(primitives),
            },
            update: {
                issue_description: primitives.description,
                probability: primitives.probability,
                consequence: primitives.consequence,
                inherent_risk_level: primitives.riskLevel,
                status: primitives.status,
                assigned_tech_id: primitives.assignedTechId,
                approved_by_id: primitives.approvedById,
                updated_by: primitives.updatedBy,
                updated_at: primitives.updatedAt,
                integrity_hash: this.calculateHash(primitives),
            },
        });
    }
    async findById(id) {
        const record = await this.prisma.jaxonTicket.findUnique({
            where: { id },
        });
        if (!record)
            return null;
        return this.toDomain(record);
    }
    async findByAssetId(assetId) {
        const records = await this.prisma.jaxonTicket.findMany({
            where: { asset_id: assetId },
            orderBy: { created_at: 'desc' },
        });
        return records.map((r) => this.toDomain(r));
    }
    async findByStatus(status) {
        const records = await this.prisma.jaxonTicket.findMany({
            where: { status },
            orderBy: { created_at: 'desc' },
        });
        return records.map((r) => this.toDomain(r));
    }
    async findPendingApprovals() {
        const records = await this.prisma.jaxonTicket.findMany({
            where: { status: 'PENDING_APPROVAL' },
            orderBy: [
                { inherent_risk_level: 'desc' }, // Most critical first
                { created_at: 'asc' }, // Oldest first (FIFO)
            ],
        });
        return records.map((r) => this.toDomain(r));
    }
    async findAll(limit = 10, offset = 0) {
        const records = await this.prisma.jaxonTicket.findMany({
            take: limit,
            skip: offset,
            orderBy: { created_at: 'desc' },
        });
        return records.map((r) => this.toDomain(r));
    }
    async findByAssignedTech(techId) {
        const records = await this.prisma.jaxonTicket.findMany({
            where: { assigned_tech_id: techId },
            orderBy: { created_at: 'desc' },
        });
        return records.map((r) => this.toDomain(r));
    }
    async count() {
        return this.prisma.jaxonTicket.count();
    }
    async delete(id) {
        // Soft delete: mark as CLOSED
        const ticket = await this.findById(id);
        if (ticket) {
            ticket.close('system');
            await this.save(ticket);
        }
    }
    /**
     * Convert Prisma record to Ticket domain entity
     */
    toDomain(record) {
        const primitives = {
            id: record.id,
            assetId: record.asset_id,
            description: record.issue_description,
            probability: record.probability,
            consequence: record.consequence,
            riskLevel: record.inherent_risk_level,
            status: record.status,
            assignedTechId: record.assigned_tech_id,
            approvedById: record.approved_by_id,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        };
        return Ticket.reconstruct(primitives);
    }
    /**
     * Calculate SHA256 integrity hash for audit
     */
    calculateHash(primitives) {
        // TODO: Implement SHA256 hash
        // For now, return placeholder
        return Buffer.from(JSON.stringify(primitives)).toString('hex').substring(0, 64);
    }
}
//# sourceMappingURL=TicketRepository.js.map