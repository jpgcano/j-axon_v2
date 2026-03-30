import { z } from 'zod';
import { AssetStatus } from '../../domain/assets/Asset.js';
const createAssetSchema = z.object({
    description: z.string().min(3),
    category: z.string().min(2),
    status: z.nativeEnum(AssetStatus).optional(),
}).strict();
const updateAssetSchema = z.object({
    description: z.string().min(3).optional(),
    category: z.string().min(2).optional(),
    status: z.nativeEnum(AssetStatus).optional(),
}).strict();
const assignAssetSchema = z.object({
    assigneeId: z.string().uuid(),
}).strict();
const updateAssetStatusSchema = z.object({
    status: z.nativeEnum(AssetStatus),
    reason: z.string().min(3).optional(),
    currentIntegrityHash: z.string().min(64),
}).strict();
export class AssetController {
    createAsset;
    listAssets;
    getAsset;
    updateAsset;
    assignAsset;
    updateAssetStatus;
    unassignAsset;
    constructor(createAsset, listAssets, getAsset, updateAsset, assignAsset, updateAssetStatus, unassignAsset) {
        this.createAsset = createAsset;
        this.listAssets = listAssets;
        this.getAsset = getAsset;
        this.updateAsset = updateAsset;
        this.assignAsset = assignAsset;
        this.updateAssetStatus = updateAssetStatus;
        this.unassignAsset = unassignAsset;
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
    assign = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = assignAssetSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const asset = await this.assignAsset.execute({
                id: id,
                assigneeId: data.assigneeId,
                actorId,
            });
            res.status(200).json(asset.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = updateAssetStatusSchema.parse(req.body);
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const asset = await this.updateAssetStatus.execute({
                id: id,
                status: data.status,
                reason: data.reason,
                currentIntegrityHash: data.currentIntegrityHash,
                actorId,
            });
            res.status(200).json(asset.toPrimitives());
        }
        catch (error) {
            next(error);
        }
    };
    unassign = async (req, res, next) => {
        try {
            const { id } = req.params;
            const actorId = req.user?.id;
            if (!actorId) {
                res.status(401).json({ error: 'Unauthorized user context missing' });
                return;
            }
            const asset = await this.unassignAsset.execute({
                id: id,
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