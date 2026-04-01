import { Asset } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

export class GetAsset {
  constructor(private readonly assetRepository: AssetRepository) {}

  public async execute(id: string): Promise<Asset> {
    const asset = await this.assetRepository.findById(id);

    if (!asset) {
      throw new NotFoundException('Asset', id);
    }

    return asset;
  }
}
