import { PrismaClient } from '../../../generated/prisma/client.js';
import { AuditLog } from '../../domain/audit/AuditLog.js';
export class PrismaAuditLogRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(log) {
        await this.prisma.jaxonAuditLog.create({
            data: {
                id_log: log.id,
                entity_table: log.entityName,
                entity_id: log.entityId,
                action_type: log.action,
                payload_before: log.payloadBefore,
                payload_after: log.payloadAfter,
                actor_id: log.actorId,
                ip_origin: log.ipOrigin,
                hash_prev: log.hashPrev,
                hash_current: log.hashCurrent,
                created_at: log.createdAt,
            },
        });
    }
    async findLastByEntity(entityName) {
        const row = await this.prisma.jaxonAuditLog.findFirst({
            where: { entity_table: entityName },
            orderBy: { created_at: 'desc' },
        });
        if (!row)
            return null;
        return this.mapToDomain(row);
    }
    async findLastGlobal() {
        const row = await this.prisma.jaxonAuditLog.findFirst({
            orderBy: { created_at: 'desc' },
        });
        if (!row)
            return null;
        return this.mapToDomain(row);
    }
    async findAll() {
        const rows = await this.prisma.jaxonAuditLog.findMany({
            orderBy: { created_at: 'desc' },
        });
        return rows.map(this.mapToDomain);
    }
    mapToDomain(row) {
        return new AuditLog(row.id_log, row.entity_table, row.entity_id, row.action_type, row.payload_before, row.payload_after, row.actor_id, row.ip_origin, row.hash_prev, row.hash_current, row.created_at);
    }
}
//# sourceMappingURL=PrismaAuditLogRepository.js.map