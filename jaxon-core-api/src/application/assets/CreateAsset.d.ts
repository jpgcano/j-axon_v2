import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import type { AuditLogger } from '../audit/AuditLogger.js';
export interface CreateAssetRequest {
    description: string;
    category: string;
    status?: AssetStatus;
    actorId: string;
}
export declare class CreateAsset {
    private readonly assetRepository;
    private readonly auditLogger;
    constructor(assetRepository: AssetRepository, auditLogger: AuditLogger);
    execute(request: CreateAssetRequest): Promise<Asset>;
}
//# sourceMappingURL=CreateAsset.d.ts.map