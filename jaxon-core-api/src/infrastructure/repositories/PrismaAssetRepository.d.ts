import type { PrismaClient } from '../../../generated/prisma/client.js';
import { Asset } from '../../domain/assets/Asset.js';
import type { AssetRepository } from '../../domain/assets/AssetRepository.js';
export declare class PrismaAssetRepository implements AssetRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private generateIntegrityHash;
    save(asset: Asset): Promise<void>;
    findById(id: string): Promise<Asset | null>;
    findAll(): Promise<Asset[]>;
    findByAssignedUser(userId: string): Promise<Asset[]>;
}
//# sourceMappingURL=PrismaAssetRepository.d.ts.map