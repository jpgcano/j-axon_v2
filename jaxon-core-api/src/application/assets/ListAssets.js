import { Asset } from '../../domain/assets/Asset.js';
export class ListAssets {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async execute() {
        return await this.assetRepository.findAll();
    }
}
//# sourceMappingURL=ListAssets.js.map