import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
export class UpdateAsset {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async execute(request) {
        const existingAsset = await this.assetRepository.findById(request.id);
        if (!existingAsset) {
            throw new Error('Asset not found');
        }
        const updatedAsset = new Asset({
            ...existingAsset.props,
            description: request.description ?? existingAsset.props.description,
            category: request.category ?? existingAsset.props.category,
            status: request.status ?? existingAsset.props.status,
            updatedBy: request.actorId,
            updatedAt: new Date(),
        });
        await this.assetRepository.save(updatedAsset);
        return updatedAsset;
    }
}
//# sourceMappingURL=UpdateAsset.js.map