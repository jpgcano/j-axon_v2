import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { createHash } from 'crypto';

export class PrismaMaintenanceRepository implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(maintenance: Maintenance): Promise<void> {
    const props = maintenance.toPrimitives();
    const integrityHash = this.calculateIntegrityHash(props);

    await this.prisma.jaxonMaintenance.upsert({
      where: { id: props.id },
      update: {
        asset_id: props.assetId,
        ticket_id: props.ticketId,
        type: props.type as any,
        description: props.description,
        scheduled_date: props.scheduledDate,
        completed_date: props.completedDate,
        status: props.status as any,
        assigned_tech_id: props.assignedTechId,
        updated_by: props.updatedBy,
        updated_at: props.updatedAt,
        integrity_hash: integrityHash,
      },
      create: {
        id: props.id,
        asset_id: props.assetId,
        ticket_id: props.ticketId,
        type: props.type as any,
        description: props.description,
        scheduled_date: props.scheduledDate,
        completed_date: props.completedDate,
        status: props.status as any,
        assigned_tech_id: props.assignedTechId,
        created_by: props.createdBy,
        updated_by: props.updatedBy,
        created_at: props.createdAt,
        updated_at: props.updatedAt,
        ip_origin: '127.0.0.1', 
        integrity_hash: integrityHash,
      },
    });
  }

  public async findById(id: string): Promise<Maintenance | null> {
    const record = await this.prisma.jaxonMaintenance.findUnique({
      where: { id },
    });

    if (!record) return null;

    return new Maintenance({
      id: record.id,
      assetId: record.asset_id,
      ticketId: record.ticket_id || null,
      type: record.type as any,
      description: record.description,
      scheduledDate: record.scheduled_date,
      completedDate: record.completed_date || null,
      status: record.status as any,
      assignedTechId: record.assigned_tech_id || null,
      createdBy: record.created_by,
      updatedBy: record.updated_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  public async findAll(): Promise<Maintenance[]> {
    const records = await this.prisma.jaxonMaintenance.findMany();
    return records.map(record => new Maintenance({
      id: record.id,
      assetId: record.asset_id,
      ticketId: record.ticket_id || null,
      type: record.type as any,
      description: record.description,
      scheduledDate: record.scheduled_date,
      completedDate: record.completed_date || null,
      status: record.status as any,
      assignedTechId: record.assigned_tech_id || null,
      createdBy: record.created_by,
      updatedBy: record.updated_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));
  }

  public async findByAssetId(assetId: string): Promise<Maintenance[]> {
    const records = await this.prisma.jaxonMaintenance.findMany({
      where: { asset_id: assetId },
    });
    return records.map(record => new Maintenance({
      id: record.id,
      assetId: record.asset_id,
      ticketId: record.ticket_id || null,
      type: record.type as any,
      description: record.description,
      scheduledDate: record.scheduled_date,
      completedDate: record.completed_date || null,
      status: record.status as any,
      assignedTechId: record.assigned_tech_id || null,
      createdBy: record.created_by,
      updatedBy: record.updated_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));
  }

  public async findByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    const records = await this.prisma.jaxonMaintenance.findMany({
      where: { status: status as any },
    });
    return records.map(record => new Maintenance({
      id: record.id,
      assetId: record.asset_id,
      ticketId: record.ticket_id || null,
      type: record.type as any,
      description: record.description,
      scheduledDate: record.scheduled_date,
      completedDate: record.completed_date || null,
      status: record.status as any,
      assignedTechId: record.assigned_tech_id || null,
      createdBy: record.created_by,
      updatedBy: record.updated_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));
  }

  public async findByAssignedTech(techId: string): Promise<Maintenance[]> {
    const records = await this.prisma.jaxonMaintenance.findMany({
      where: { assigned_tech_id: techId },
    });
    return records.map(record => new Maintenance({
      id: record.id,
      assetId: record.asset_id,
      ticketId: record.ticket_id || null,
      type: record.type as any,
      description: record.description,
      scheduledDate: record.scheduled_date,
      completedDate: record.completed_date || null,
      status: record.status as any,
      assignedTechId: record.assigned_tech_id || null,
      createdBy: record.created_by,
      updatedBy: record.updated_by,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    }));
  }

  private calculateIntegrityHash(props: any): string {
    const data = `${props.id}|${props.status}|${props.updatedAt.toISOString()}`;
    return createHash('sha256').update(data).digest('hex');
  }
}
