import type { AuditLogger } from './application/audit/AuditLogger.js';
export interface AssetRepository {
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}
export declare class AnullationAssetService {
    private assetRepository;
    private auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    voidAsset(assetId: string, reason: string, actorId: string, ip: string): Promise<void>;
}
//# sourceMappingURL=AnullationAssetService.d.ts.map