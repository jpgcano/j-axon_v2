import { createHash } from 'crypto';
import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import { getRequestContext } from '../context/RequestContext.js';
export class PrismaAssetRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateIntegrityHash(id, description, date) {
        const data = `${id}|${description}|${date.toISOString()}`;
        return createHash('sha256').update(data).digest('hex');
    }
    async save(asset) {
        const props = asset.toPrimitives();
        const systemIp = getRequestContext().ipOrigin || '0.0.0.0';
        const integrityHash = this.generateIntegrityHash(props.id, props.description, props.updatedAt);
        await this.prisma.jaxonUser.findUnique({ where: { id: props.createdBy } }); // Sanity check if needed
        await this.prisma.jaxonAsset.upsert({
            where: { id: props.id },
            update: {
                description: props.description,
                category: props.category,
                status: props.status,
                assigned_to: props.assignedTo,
                updated_by: props.updatedBy,
                updated_at: props.updatedAt,
                ip_origin: systemIp,
                integrity_hash: integrityHash,
            },
            create: {
                id: props.id,
                description: props.description,
                category: props.category,
                status: props.status,
                assigned_to: props.assignedTo,
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
        const data = await this.prisma.jaxonAsset.findUnique({
            where: { id },
        });
        if (!data)
            return null;
        return new Asset({
            id: data.id,
            description: data.description,
            category: data.category,
            status: data.status,
            assignedTo: data.assigned_to,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        });
    }
    async findAll() {
        const rows = await this.prisma.jaxonAsset.findMany({
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Asset({
            id: data.id,
            description: data.description,
            category: data.category,
            status: data.status,
            assignedTo: data.assigned_to,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findByAssignedUser(userId) {
        const rows = await this.prisma.jaxonAsset.findMany({
            where: { assigned_to: userId },
            orderBy: { created_at: 'desc' },
        });
        return rows.map((data) => new Asset({
            id: data.id,
            description: data.description,
            category: data.category,
            status: data.status,
            assignedTo: data.assigned_to,
            createdBy: data.created_by,
            updatedBy: data.updated_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }));
    }
    async findIntegrityHash(id) {
        const row = await this.prisma.jaxonAsset.findUnique({
            where: { id },
            select: { integrity_hash: true },
        });
        return row?.integrity_hash ?? null;
    }
}
//# sourceMappingURL=PrismaAssetRepository.js.map