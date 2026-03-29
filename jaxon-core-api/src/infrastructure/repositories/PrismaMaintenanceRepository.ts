import type { PrismaClient } from '../../../generated/prisma/client.js';
import { createHash } from 'crypto';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';

export class PrismaMaintenanceRepository implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private generateIntegrityHash(id: string, updateDate: Date, status: string): string {
    const data = `${id}|${status}|${updateDate.toISOString()}`;
    return createHash('sha256').update(data).digest('hex');
  }

  public async save(maintenance: Maintenance): Promise<void> {
    const props = maintenance.toPrimitives();
    const systemIp = '127.0.0.1';
    const integrityHash = this.generateIntegrityHash(props.id, props.updatedAt, props.status);

    await this.prisma.jaxonMaintenance.upsert({
      where: { id: props.id },
      update: {
        type: props.type as any,
        description: props.description,
        scheduled_date: props.scheduledDate,
        completed_date: props.completedDate,
        status: props.status as any,
        asset_id: props.assetId,
        ticket_id: props.ticketId,
        assigned_tech_id: props.assignedTechId,
        updated_by: props.updatedBy,
        updated_at: props.updatedAt,
        ip_origin: systemIp,
        integrity_hash: integrityHash,
      },
      create: {
        id: props.id,
        type: props.type as any,
        description: props.description,
        scheduled_date: props.scheduledDate,
        completed_date: props.completedDate,
        status: props.status as any,
        asset_id: props.assetId,
        ticket_id: props.ticketId,
        assigned_tech_id: props.assignedTechId,
        created_by: props.createdBy,
        updated_by: props.updatedBy,
        created_at: props.createdAt,
        updated_at: props.updatedAt,
        ip_origin: systemIp,
        integrity_hash: integrityHash,
      },
    });
  }

  public async findById(id: string): Promise<Maintenance | null> {
    const data = await this.prisma.jaxonMaintenance.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Maintenance({
      id: data.id,
      assetId: data.asset_id,
      ticketId: data.ticket_id,
      type: data.type as unknown as MaintenanceType,
      description: data.description,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      status: data.status as unknown as MaintenanceStatus,
      assignedTechId: data.assigned_tech_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  }

  public async findAll(): Promise<Maintenance[]> {
    const rows = await this.prisma.jaxonMaintenance.findMany({
      orderBy: { scheduled_date: 'asc' },
    });

    return rows.map((data: any) => new Maintenance({
      id: data.id,
      assetId: data.asset_id,
      ticketId: data.ticket_id,
      type: data.type as unknown as MaintenanceType,
      description: data.description,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      status: data.status as unknown as MaintenanceStatus,
      assignedTechId: data.assigned_tech_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }

  public async findByAssetId(assetId: string): Promise<Maintenance[]> {
    const rows = await this.prisma.jaxonMaintenance.findMany({
      where: { asset_id: assetId },
      orderBy: { scheduled_date: 'asc' },
    });

    return rows.map((data: any) => new Maintenance({
      id: data.id,
      assetId: data.asset_id,
      ticketId: data.ticket_id,
      type: data.type as unknown as MaintenanceType,
      description: data.description,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      status: data.status as unknown as MaintenanceStatus,
      assignedTechId: data.assigned_tech_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }

  public async findByStatus(status: MaintenanceStatus): Promise<Maintenance[]> {
    const rows = await this.prisma.jaxonMaintenance.findMany({
      where: { status: status as any },
      orderBy: { scheduled_date: 'asc' },
    });

    return rows.map((data: any) => new Maintenance({
      id: data.id,
      assetId: data.asset_id,
      ticketId: data.ticket_id,
      type: data.type as unknown as MaintenanceType,
      description: data.description,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      status: data.status as unknown as MaintenanceStatus,
      assignedTechId: data.assigned_tech_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }
  
  public async findByAssignedTech(techId: string): Promise<Maintenance[]> {
    const rows = await this.prisma.jaxonMaintenance.findMany({
      where: { assigned_tech_id: techId },
      orderBy: { scheduled_date: 'asc' },
    });

    return rows.map((data: any) => new Maintenance({
      id: data.id,
      assetId: data.asset_id,
      ticketId: data.ticket_id,
      type: data.type as unknown as MaintenanceType,
      description: data.description,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      status: data.status as unknown as MaintenanceStatus,
      assignedTechId: data.assigned_tech_id,
      createdBy: data.created_by,
      updatedBy: data.updated_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }));
  }
}
