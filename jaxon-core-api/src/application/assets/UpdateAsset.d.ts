import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
export interface UpdateAssetRequest {
    id: string;
    description?: string;
    category?: string;
    status?: AssetStatus;
    actorId: string;
}
export declare class UpdateAsset {
    private readonly assetRepository;
    constructor(assetRepository: AssetRepository);
    execute(request: UpdateAssetRequest): Promise<Asset>;
}
//# sourceMappingURL=UpdateAsset.d.ts.map