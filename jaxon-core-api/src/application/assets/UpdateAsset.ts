import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';

export interface UpdateAssetRequest {
  id: string;
  description?: string;
  category?: string;
  status?: AssetStatus;
  actorId: string;
}

export class UpdateAsset {
  constructor(private readonly assetRepository: AssetRepository) {}

  public async execute(request: UpdateAssetRequest): Promise<Asset> {
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