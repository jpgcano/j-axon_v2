import { Asset } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
export declare class GetAsset {
    private readonly assetRepository;
    constructor(assetRepository: AssetRepository);
    execute(id: string): Promise<Asset>;
}
//# sourceMappingURL=GetAsset.d.ts.map