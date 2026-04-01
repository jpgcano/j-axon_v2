import { Asset } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';

export class ListAssets {
  constructor(private readonly assetRepository: AssetRepository) {}

  public async execute(): Promise<Asset[]> {
    return await this.assetRepository.findAll();
  }
}
