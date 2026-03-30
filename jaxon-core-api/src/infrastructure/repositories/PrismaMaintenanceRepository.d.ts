import { Maintenance, MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';
export declare class PrismaMaintenanceRepository implements MaintenanceRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    save(maintenance: Maintenance): Promise<void>;
    findById(id: string): Promise<Maintenance | null>;
    findAll(): Promise<Maintenance[]>;
    findByAssetId(assetId: string): Promise<Maintenance[]>;
    findByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
    findByAssignedTech(techId: string): Promise<Maintenance[]>;
    private calculateIntegrityHash;
}
//# sourceMappingURL=PrismaMaintenanceRepository.d.ts.map