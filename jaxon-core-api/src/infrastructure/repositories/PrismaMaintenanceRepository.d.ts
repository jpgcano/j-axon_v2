import type { PrismaClient } from '../../../generated/prisma/client.js';
import { Maintenance, MaintenanceStatus } from '../../domain/maintenance/Maintenance.js';
import type { MaintenanceRepository } from '../../domain/maintenance/MaintenanceRepository.js';
export declare class PrismaMaintenanceRepository implements MaintenanceRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private generateIntegrityHash;
    save(maintenance: Maintenance): Promise<void>;
    findById(id: string): Promise<Maintenance | null>;
    findAll(): Promise<Maintenance[]>;
    findByAssetId(assetId: string): Promise<Maintenance[]>;
    findByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
    findByAssignedTech(techId: string): Promise<Maintenance[]>;
}
//# sourceMappingURL=PrismaMaintenanceRepository.d.ts.map