import { PrismaClient } from '../../../generated/prisma/client.js';
import { AuditLog } from '../../domain/audit/AuditLog.js';
import type { AuditLogRepository } from '../../domain/audit/AuditLogRepository.js';

export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async save(log: AuditLog): Promise<void> {
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

  public async findLastByEntity(entityName: string): Promise<AuditLog | null> {
    const row = await this.prisma.jaxonAuditLog.findFirst({
      where: { entity_table: entityName },
      orderBy: [
        { created_at: 'desc' },
        { id_log: 'desc' },
      ],
    });

    if (!row) return null;
    return this.mapToDomain(row);
  }

  public async findLastGlobal(): Promise<AuditLog | null> {
    const row = await this.prisma.jaxonAuditLog.findFirst({
      orderBy: [
        { created_at: 'desc' },
        { id_log: 'desc' },
      ],
    });

    if (!row) return null;
    return this.mapToDomain(row);
  }

  public async findAll(): Promise<AuditLog[]> {
    const rows = await this.prisma.jaxonAuditLog.findMany({
      orderBy: [
        { created_at: 'desc' },
        { id_log: 'desc' },
      ],
    });
    return rows.map(this.mapToDomain);
  }

  private mapToDomain(row: any): AuditLog {
    return new AuditLog(
      row.id_log,
      row.entity_table,
      row.entity_id,
      row.action_type,
      row.payload_before,
      row.payload_after,
      row.actor_id,
      row.ip_origin,
      row.hash_prev,
      row.hash_current,
      row.created_at
    );
  }
}
