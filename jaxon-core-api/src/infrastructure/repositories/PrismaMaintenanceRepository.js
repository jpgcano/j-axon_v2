import { createHash } from 'crypto';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
export class PrismaMaintenanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateIntegrityHash(id, updateDate, status) {
        const data = `${id}|${status}|${updateDate.toISOString()}`;
        return createHash('sha256').update(data).digest('hex');
    }
    async save(maintenance) {
        const props = maintenance.toPrimitives();
        const systemIp = '127.0.0.1';
        const integrityHash = this.generateIntegrityHash(props.id, props.updatedAt, props.status);
        await this.prisma.jaxonMaintenance.upsert({
            where: { id: props.id },
            update: {
                type: props.type,
                description: props.description,
                scheduled_date: props.scheduledDate,
                completed_date: props.completedDate,
                status: props.status,
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
                type: props.type,
                description: props.description,
                scheduled_date: props.scheduledDate,
                completed_date: props.completedDate,
                status: props.status,
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
    async findById(id) {
        const data = await this.prisma.jaxonMaintenance.findUnique({
            where: { id },
        });
        if (!data)
            return null;
        return new Maintenance({
            id: data.id,
            assetId: data.asset_id,
            ticketId: data.ticket_id,
            type: data.type,
            description: data.description,
            scheduledDate: data.scheduled_date,
            completedDate: data.completed_date,
            status: data.status,
            assignedTechId: data.assigned_tech_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async findAll() {
        const rows = await this.prisma.jaxonMaintenance.findMany({
            orderBy: { scheduled_date: 'asc' },
        });
        return rows.map((data) => new Maintenance({
            id: data.id,
            assetId: data.asset_id,
            ticketId: data.ticket_id,
            type: data.type,
            description: data.description,
            scheduledDate: data.scheduled_date,
            completedDate: data.completed_date,
            status: data.status,
            assignedTechId: data.assigned_tech_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByAssetId(assetId) {
        const rows = await this.prisma.jaxonMaintenance.findMany({
            where: { asset_id: assetId },
            orderBy: { scheduled_date: 'asc' },
        });
        return rows.map((data) => new Maintenance({
            id: data.id,
            assetId: data.asset_id,
            ticketId: data.ticket_id,
            type: data.type,
            description: data.description,
            scheduledDate: data.scheduled_date,
            completedDate: data.completed_date,
            status: data.status,
            assignedTechId: data.assigned_tech_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByStatus(status) {
        const rows = await this.prisma.jaxonMaintenance.findMany({
            where: { status: status },
            orderBy: { scheduled_date: 'asc' },
        });
        return rows.map((data) => new Maintenance({
            id: data.id,
            assetId: data.asset_id,
            ticketId: data.ticket_id,
            type: data.type,
            description: data.description,
            scheduledDate: data.scheduled_date,
            completedDate: data.completed_date,
            status: data.status,
            assignedTechId: data.assigned_tech_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByAssignedTech(techId) {
        const rows = await this.prisma.jaxonMaintenance.findMany({
            where: { assigned_tech_id: techId },
            orderBy: { scheduled_date: 'asc' },
        });
        return rows.map((data) => new Maintenance({
            id: data.id,
            assetId: data.asset_id,
            ticketId: data.ticket_id,
            type: data.type,
            description: data.description,
            scheduledDate: data.scheduled_date,
            completedDate: data.completed_date,
            status: data.status,
            assignedTechId: data.assigned_tech_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
}
//# sourceMappingURL=PrismaMaintenanceRepository.js.map