/**
 * Ticket Repository Implementation
 * Persists Ticket aggregate to PostgreSQL via Prisma ORM
 * 
 * Responsibilities:
 * - Map Ticket domain objects to/from database
 * - Execute queries for ticket lookups
 * - Enforce data consistency via transactions
 */

import { PrismaClient } from '@prisma/client';
import { Ticket, TicketPrimitives, TicketRepository } from '../../../domain/tickets/index.js';
import { TicketStatus } from '../../../domain/tickets/value-objects/TicketStatus.js';

export class PrismaTicketRepository implements TicketRepository {
  constructor(private prisma: PrismaClient) {}

  async save(ticket: Ticket): Promise<void> {
    const primitives = ticket.toPrimitives();

    await this.prisma.jaxonTicket.upsert({
      where: { id: primitives.id },
      create: {
        id: primitives.id,
        asset_id: primitives.assetId,
        issue_description: primitives.description,
        probability: primitives.probability,
        consequence: primitives.consequence,
        inherent_risk_level: primitives.riskLevel as any,
        status: primitives.status as any,
        assigned_tech_id: primitives.assignedTechId,
        approved_by_id: primitives.approvedById,
        created_by: primitives.createdBy,
        updated_by: primitives.updatedBy,
        created_at: primitives.createdAt,
        updated_at: primitives.updatedAt,
        ip_origin: '0.0.0.0/0', // TODO: get from request context
        integrity_hash: this.calculateHash(primitives),
      },
      update: {
        issue_description: primitives.description,
        probability: primitives.probability,
        consequence: primitives.consequence,
        inherent_risk_level: primitives.riskLevel as any,
        status: primitives.status as any,
        assigned_tech_id: primitives.assignedTechId,
        approved_by_id: primitives.approvedById,
        updated_by: primitives.updatedBy,
        updated_at: primitives.updatedAt,
        integrity_hash: this.calculateHash(primitives),
      },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const record = await this.prisma.jaxonTicket.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findByAssetId(assetId: string): Promise<Ticket[]> {
    const records = await this.prisma.jaxonTicket.findMany({
      where: { asset_id: assetId },
      orderBy: { created_at: 'desc' },
    });

    return records.map((r) => this.toDomain(r));
  }

  async findByStatus(status: string): Promise<Ticket[]> {
    const records = await this.prisma.jaxonTicket.findMany({
      where: { status },
      orderBy: { created_at: 'desc' },
    });

    return records.map((r) => this.toDomain(r));
  }

  async findPendingApprovals(): Promise<Ticket[]> {
    const records = await this.prisma.jaxonTicket.findMany({
      where: { status: 'PENDING_APPROVAL' },
      orderBy: [
        { inherent_risk_level: 'desc' }, // Most critical first
        { created_at: 'asc' }, // Oldest first (FIFO)
      ],
    });

    return records.map((r) => this.toDomain(r));
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<Ticket[]> {
    const records = await this.prisma.jaxonTicket.findMany({
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
    });

    return records.map((r) => this.toDomain(r));
  }

  async findByAssignedTech(techId: string): Promise<Ticket[]> {
    const records = await this.prisma.jaxonTicket.findMany({
      where: { assigned_tech_id: techId },
      orderBy: { created_at: 'desc' },
    });

    return records.map((r) => this.toDomain(r));
  }

  async count(): Promise<number> {
    return this.prisma.jaxonTicket.count();
  }

  async delete(id: string): Promise<void> {
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
  private toDomain(record: any): Ticket {
    const primitives: TicketPrimitives = {
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
  private calculateHash(primitives: TicketPrimitives): string {
    // TODO: Implement SHA256 hash
    // For now, return placeholder
    return Buffer.from(JSON.stringify(primitives)).toString('hex').substring(0, 64);
  }
}
