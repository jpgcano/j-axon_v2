import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface AssignAssetRequest {
    id: string;
    assigneeId: string;
    actorId: string;
}
export declare class AssignAsset {
    private readonly assetRepository;
    private readonly auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: AssignAssetRequest): Promise<import("../../domain/assets/Asset.js").Asset>;
}
//# sourceMappingURL=AssignAsset.d.ts.map