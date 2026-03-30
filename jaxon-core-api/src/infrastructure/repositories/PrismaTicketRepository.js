import { createHash } from 'crypto';
import { Ticket, TicketStatus, RiskLevel } from '../../domain/tickets/Ticket.js';
export class PrismaTicketRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateIntegrityHash(id, updateDate, status) {
        const data = `${id}|${status}|${updateDate.toISOString()}`;
        return createHash('sha256').update(data).digest('hex');
    }
    async save(ticket) {
        const props = ticket.toPrimitives();
        const systemIp = '127.0.0.1';
        const integrityHash = this.generateIntegrityHash(props.id, props.updatedAt, props.status);
        await this.prisma.jaxonTicket.upsert({
            where: { id: props.id },
            update: {
                issue_description: props.issueDescription,
                status: props.status,
                inherent_risk_level: props.inherentRiskLevel,
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
                status: props.status,
                inherent_risk_level: props.inherentRiskLevel,
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
    async findById(id) {
        const data = await this.prisma.jaxonTicket.findUnique({
            where: { id },
        });
        if (!data)
            return null;
        return new Ticket({
            id: data.id,
            issueDescription: data.issue_description,
            status: data.status,
            inherentRiskLevel: data.inherent_risk_level,
            assetId: data.asset_id,
            assignedTechId: data.assigned_tech_id,
            approvedById: data.approved_by_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async findAll() {
        const rows = await this.prisma.jaxonTicket.findMany({
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Ticket({
            id: data.id,
            issueDescription: data.issue_description,
            status: data.status,
            inherentRiskLevel: data.inherent_risk_level,
            assetId: data.asset_id,
            assignedTechId: data.assigned_tech_id,
            approvedById: data.approved_by_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByAssetId(assetId) {
        const rows = await this.prisma.jaxonTicket.findMany({
            where: { asset_id: assetId },
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Ticket({
            id: data.id,
            issueDescription: data.issue_description,
            status: data.status,
            inherentRiskLevel: data.inherent_risk_level,
            assetId: data.asset_id,
            assignedTechId: data.assigned_tech_id,
            approvedById: data.approved_by_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByStatus(status) {
        const rows = await this.prisma.jaxonTicket.findMany({
            where: { status: status },
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Ticket({
            id: data.id,
            issueDescription: data.issue_description,
            status: data.status,
            inherentRiskLevel: data.inherent_risk_level,
            assetId: data.asset_id,
            assignedTechId: data.assigned_tech_id,
            approvedById: data.approved_by_id,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByAssignedTech(techId) {
        const rows = await this.prisma.jaxonTicket.findMany({
            where: { assigned_tech_id: techId },
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Ticket({
            id: data.id,
            issueDescription: data.issue_description,
            status: data.status,
            inherentRiskLevel: data.inherent_risk_level,
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
//# sourceMappingURL=PrismaTicketRepository.js.map