import type { PrismaClient } from '../../../generated/prisma/client.js';
import { createHash } from 'crypto';
import { Ticket, TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';

export class PrismaTicketRepository implements TicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private generateIntegrityHash(id: string, updateDate: Date, status: string): string {
    const data = `${id}|${status}|${updateDate.toISOString()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  public async save(ticket: Ticket): Promise<void> {
    const props = ticket.toPrimitives();
    const systemIp = '127.0.0.1';
    const integrityHash = this.generateIntegrityHash(props.id, props.updatedAt, props.status);

    await this.prisma.jaxonTicket.upsert({
      where: { id: props.id },
      update: {
        issue_description: props.issueDescription,
        status: props.status as any,
        inherent_risk_level: props.inherentRiskLevel as any,
        asset_id: props.assetId,
        assigned_tech_id: props.assignedTechId,
        approved_by_id: props.approvedById,
        updated_by: props.updatedBy,
        updated_at: props.updatedAt,
        ip_origin: systemIp,
        integrity_hash: integrityHash,
      },
      create: {
        id: props.id,
        issue_description: props.issueDescription,
        status: props.status as any,
        inherent_risk_level: props.inherentRiskLevel as any,
        asset_id: props.assetId,
        assigned_tech_id: props.assignedTechId,
        approved_by_id: props.approvedById,
        created_by: props.createdBy,
        updated_by: props.updatedBy,
        created_at: props.createdAt,
        updated_at: props.updatedAt,
        ip_origin: systemIp,
        integrity_hash: integrityHash,
      },
    });
  }

  public async findById(id: string): Promise<Ticket | null> {
    const data = await this.prisma.jaxonTicket.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Ticket({
      id: data.id,
      issueDescription: data.issue_description,
      status: data.status as unknown as TicketStatus,
      inherentRiskLevel: data.inherent_risk_level as unknown as RiskLevel,
      assetId: data.asset_id,
      assignedTechId: data.assigned_tech_id,
      approvedById: data.approved_by_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  public async findAll(): Promise<Ticket[]> {
    const rows = await this.prisma.jaxonTicket.findMany({
      orderBy: { created_at: 'desc' },
    });

    return rows.map((data: any) => new Ticket({
      id: data.id,
      issueDescription: data.issue_description,
      status: data.status as unknown as TicketStatus,
      inherentRiskLevel: data.inherent_risk_level as unknown as RiskLevel,
      assetId: data.asset_id,
      assignedTechId: data.assigned_tech_id,
      approvedById: data.approved_by_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }

  public async findByAssetId(assetId: string): Promise<Ticket[]> {
    const rows = await this.prisma.jaxonTicket.findMany({
      where: { asset_id: assetId },
      orderBy: { created_at: 'desc' },
    });

    return rows.map((data: any) => new Ticket({
      id: data.id,
      issueDescription: data.issue_description,
      status: data.status as unknown as TicketStatus,
      inherentRiskLevel: data.inherent_risk_level as unknown as RiskLevel,
      assetId: data.asset_id,
      assignedTechId: data.assigned_tech_id,
      approvedById: data.approved_by_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }

  public async findByStatus(status: TicketStatus): Promise<Ticket[]> {
    const rows = await this.prisma.jaxonTicket.findMany({
      where: { status: status as any },
      orderBy: { created_at: 'desc' },
    });

    return rows.map((data: any) => new Ticket({
      id: data.id,
      issueDescription: data.issue_description,
      status: data.status as unknown as TicketStatus,
      inherentRiskLevel: data.inherent_risk_level as unknown as RiskLevel,
      assetId: data.asset_id,
      assignedTechId: data.assigned_tech_id,
      approvedById: data.approved_by_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }
  
  public async findByAssignedTech(techId: string): Promise<Ticket[]> {
    const rows = await this.prisma.jaxonTicket.findMany({
      where: { assigned_tech_id: techId },
      orderBy: { created_at: 'desc' },
    });

    return rows.map((data: any) => new Ticket({
      id: data.id,
      issueDescription: data.issue_description,
      status: data.status as unknown as TicketStatus,
      inherentRiskLevel: data.inherent_risk_level as unknown as RiskLevel,
      assetId: data.asset_id,
      assignedTechId: data.assigned_tech_id,
      approvedById: data.approved_by_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }
}
