import { Asset } from './Asset.js';
export interface AssetRepository {
    save(asset: Asset): Promise<void>;
    findById(id: string): Promise<Asset | null>;
    findAll(): Promise<Asset[]>;
    findByAssignedUser(userId: string): Promise<Asset[]>;
    findIntegrityHash(id: string): Promise<string | null>;
}
//# sourceMappingURL=AssetRepository.d.ts.map