import { Maintenance, MaintenanceStatus } from './Maintenance.js';
export interface MaintenanceRepository {
    save(maintenance: Maintenance): Promise<void>;
    findById(id: string): Promise<Maintenance | null>;
    findByAssetId(assetId: string): Promise<Maintenance[]>;
    findByStatus(status: MaintenanceStatus): Promise<Maintenance[]>;
    findByAssignedTech(techId: string): Promise<Maintenance[]>;
}
//# sourceMappingURL=MaintenanceRepository.d.ts.map