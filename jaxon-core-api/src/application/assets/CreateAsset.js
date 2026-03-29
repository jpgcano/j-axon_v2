import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import { randomUUID } from 'crypto';
export class CreateAsset {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async execute(request) {
        const assetId = randomUUID();
        const now = new Date();
        const props = {
            id: assetId,
            description: request.description,
            category: request.category,
            status: request.status || AssetStatus.ACTIVE,
            assignedTo: null,
            createdBy: request.actorId,
            updatedBy: request.actorId,
            createdAt: now,
            updatedAt: now,
        };
        const asset = new Asset(props);
        await this.assetRepository.save(asset);
        return asset;
    }
}
//# sourceMappingURL=CreateAsset.js.map