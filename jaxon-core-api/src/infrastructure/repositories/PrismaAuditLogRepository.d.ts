import { PrismaClient } from '../../../generated/prisma/client.js';
import { AuditLog } from '../../domain/audit/AuditLog.js';
import type { AuditLogRepository } from '../../domain/audit/AuditLogRepository.js';
export declare class PrismaAuditLogRepository implements AuditLogRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(log: AuditLog): Promise<void>;
    findLastByEntity(entityName: string): Promise<AuditLog | null>;
    findLastGlobal(): Promise<AuditLog | null>;
    findAll(): Promise<AuditLog[]>;
    private mapToDomain;
}
//# sourceMappingURL=PrismaAuditLogRepository.d.ts.map