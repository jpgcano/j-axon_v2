import { Asset, AssetStatus } from '../../domain/assets/Asset.js';
import type { AssetProps } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
import { randomUUID } from 'crypto';

export interface CreateAssetRequest {
  description: string;
  category: string;
  status?: AssetStatus;
  actorId: string;
}

export class CreateAsset {
  constructor(private readonly assetRepository: AssetRepository) {}

  public async execute(request: CreateAssetRequest): Promise<Asset> {
    const assetId = randomUUID();
    const now = new Date();

    const props: AssetProps = {
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
