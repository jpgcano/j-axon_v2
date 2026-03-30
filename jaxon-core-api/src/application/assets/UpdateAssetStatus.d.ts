import { AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface UpdateAssetStatusRequest {
    id: string;
    status: AssetStatus;
    currentIntegrityHash: string;
    reason?: string;
    actorId: string;
}
export declare class UpdateAssetStatus {
    private readonly assetRepository;
    private readonly auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: UpdateAssetStatusRequest): Promise<import("../../domain/assets/Asset.js").Asset>;
}
//# sourceMappingURL=UpdateAssetStatus.d.ts.map