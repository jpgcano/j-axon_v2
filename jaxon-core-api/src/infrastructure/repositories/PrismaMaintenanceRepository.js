import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../domain/maintenance/Maintenance.js';
import { createHash } from 'crypto';
import { getRequestContext } from '../context/RequestContext.js';
export class PrismaMaintenanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(maintenance) {
        const props = maintenance.toPrimitives();
        const integrityHash = this.calculateIntegrityHash(props);
        await this.prisma.jaxonMaintenance.upsert({
            where: { id: props.id },
            update: {
                asset_id: props.assetId,
                ticket_id: props.ticketId,
                type: props.type,
                description: props.description,
                scheduled_date: props.scheduledDate,
                completed_date: props.completedDate,
                status: props.status,
                assigned_tech_id: props.assignedTechId,
                updated_by: props.updatedBy,
                updated_at: props.updatedAt,
                integrity_hash: integrityHash,
            },
            create: {
                id: props.id,
                asset_id: props.assetId,
                ticket_id: props.ticketId,
                type: props.type,
                description: props.description,
                scheduled_date: props.scheduledDate,
                completed_date: props.completedDate,
                status: props.status,
                assigned_tech_id: props.assignedTechId,
                created_by: props.createdBy,
                updated_by: props.updatedBy,
                created_at: props.createdAt,
                updated_at: props.updatedAt,
                ip_origin: getRequestContext().ipOrigin || '0.0.0.0',
                integrity_hash: integrityHash,
            },
        });
    }
    async findById(id) {
        const record = await this.prisma.jaxonMaintenance.findUnique({
            where: { id },
        });
        if (!record)
            return null;
        return new Maintenance({
            id: record.id,
            assetId: record.asset_id,
            ticketId: record.ticket_id || null,
            type: record.type,
            description: record.description,
            scheduledDate: record.scheduled_date,
            completedDate: record.completed_date || null,
            status: record.status,
            assignedTechId: record.assigned_tech_id || null,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        });
    }
    async findAll() {
        const records = await this.prisma.jaxonMaintenance.findMany();
        return records.map(record => new Maintenance({
            id: record.id,
            assetId: record.asset_id,
            ticketId: record.ticket_id || null,
            type: record.type,
            description: record.description,
            scheduledDate: record.scheduled_date,
            completedDate: record.completed_date || null,
            status: record.status,
            assignedTechId: record.assigned_tech_id || null,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        }));
    }
    async findByAssetId(assetId) {
        const records = await this.prisma.jaxonMaintenance.findMany({
            where: { asset_id: assetId },
        });
        return records.map(record => new Maintenance({
            id: record.id,
            assetId: record.asset_id,
            ticketId: record.ticket_id || null,
            type: record.type,
            description: record.description,
            scheduledDate: record.scheduled_date,
            completedDate: record.completed_date || null,
            status: record.status,
            assignedTechId: record.assigned_tech_id || null,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        }));
    }
    async findByStatus(status) {
        const records = await this.prisma.jaxonMaintenance.findMany({
            where: { status: status },
        });
        return records.map(record => new Maintenance({
            id: record.id,
            assetId: record.asset_id,
            ticketId: record.ticket_id || null,
            type: record.type,
            description: record.description,
            scheduledDate: record.scheduled_date,
            completedDate: record.completed_date || null,
            status: record.status,
            assignedTechId: record.assigned_tech_id || null,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        }));
    }
    async findByAssignedTech(techId) {
        const records = await this.prisma.jaxonMaintenance.findMany({
            where: { assigned_tech_id: techId },
        });
        return records.map(record => new Maintenance({
            id: record.id,
            assetId: record.asset_id,
            ticketId: record.ticket_id || null,
            type: record.type,
            description: record.description,
            scheduledDate: record.scheduled_date,
            completedDate: record.completed_date || null,
            status: record.status,
            assignedTechId: record.assigned_tech_id || null,
            createdBy: record.created_by,
            updatedBy: record.updated_by,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        }));
    }
    calculateIntegrityHash(props) {
        const data = `${props.id}|${props.status}|${props.updatedAt.toISOString()}`;
        return createHash('sha256').update(data).digest('hex');
    }
}
//# sourceMappingURL=PrismaMaintenanceRepository.js.map