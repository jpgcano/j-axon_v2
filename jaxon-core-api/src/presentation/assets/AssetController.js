import { z } from 'zod';
import { AssetStatus } from '../../domain/assets/Asset.js';
const updateAssetSchema = z.object({
    description: z.string().min(3).optional(),
    category: z.string().min(2).optional(),
    status: z.nativeEnum(AssetStatus).optional(),
});
export class AssetController {
    createAsset;
    listAssets;
    getAsset;
    updateAsset;
    constructor(createAsset, listAssets, getAsset, updateAsset) {
        this.createAsset = createAsset;
        this.listAssets = listAssets;
        this.getAsset = getAsset;
        this.updateAsset = updateAsset;
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
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = updateAssetSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const asset = await this.updateAsset.execute({
                id: id,
                ...data,
                actorId,
            });
            res.status(200).json(asset.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=AssetController.js.map