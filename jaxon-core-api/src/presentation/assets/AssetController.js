import { z } from 'zod';
import { AssetStatus } from '../../domain/assets/Asset.js';
const createAssetSchema = z.object({
    description: z.string().min(3),
    category: z.string().min(2),
    status: z.nativeEnum(AssetStatus).optional(),
});
export class AssetController {
    createAsset;
    listAssets;
    getAsset;
    constructor(createAsset, listAssets, getAsset) {
        this.createAsset = createAsset;
        this.listAssets = listAssets;
        this.getAsset = getAsset;
    }
    create = async (req, res, next) => {
        try {
            const data = createAssetSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const payload = {
                description: data.description,
                category: data.category,
                actorId,
            };
            if (data.status)
                payload.status = data.status;
            const asset = await this.createAsset.execute(payload);
            res.status(201).json(asset.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const assets = await this.listAssets.execute();
            res.status(200).json(assets.map(a => a.toPrimitives()));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const asset = await this.getAsset.execute(id);
            res.status(200).json(asset.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=AssetController.js.map