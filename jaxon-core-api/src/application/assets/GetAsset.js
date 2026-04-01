import { Asset } from '../../domain/assets/Asset.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
export class GetAsset {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async execute(id) {
        const asset = await this.assetRepository.findById(id);
        if (!asset) {
            throw new NotFoundException('Asset', id);
        }
        return asset;
    }
}
//# sourceMappingURL=GetAsset.js.map