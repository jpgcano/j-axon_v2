import { AuditLog } from './AuditLog.js';

export interface AuditLogRepository {
  save(log: AuditLog): Promise<void>;
  findLastByEntity(entityName: string): Promise<AuditLog | null>;
  findLastGlobal(): Promise<AuditLog | null>;
  findAll(): Promise<AuditLog[]>;
}
