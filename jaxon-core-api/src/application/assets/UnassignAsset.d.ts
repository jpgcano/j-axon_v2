import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface UnassignAssetRequest {
    id: string;
    actorId: string;
}
export declare class UnassignAsset {
    private readonly assetRepository;
    private readonly auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: UnassignAssetRequest): Promise<import("../../domain/assets/Asset.js").Asset>;
}
//# sourceMappingURL=UnassignAsset.d.ts.map