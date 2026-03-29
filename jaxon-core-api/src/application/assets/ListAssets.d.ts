import { Asset } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
export declare class ListAssets {
    private readonly assetRepository;
    constructor(assetRepository: AssetRepository);
    execute(): Promise<Asset[]>;
}
//# sourceMappingURL=ListAssets.d.ts.map