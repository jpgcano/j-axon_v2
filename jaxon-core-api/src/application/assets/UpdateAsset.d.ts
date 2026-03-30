import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface UpdateAssetRequest {
    id: string;
    description?: string;
    category?: string;
    status?: AssetStatus;
    actorId: string;
}
export declare class UpdateAsset {
    private readonly assetRepository;
    private readonly auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: UpdateAssetRequest): Promise<Asset>;
}
//# sourceMappingURL=UpdateAsset.d.ts.map