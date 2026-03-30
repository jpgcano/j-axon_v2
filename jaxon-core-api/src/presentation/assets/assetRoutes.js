import { Router } from 'express';
import { AssetController } from './AssetController.js';
import { createAsset, listAssets, getAsset, updateAsset } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
export const assetRouter = Router();
// Protect all asset routes with authentication
assetRouter.use(authMiddleware);
const assetController = new AssetController(createAsset, listAssets, getAsset, updateAsset);
assetRouter.post('/', assetController.create);
assetRouter.get('/', assetController.list);
assetRouter.get('/:id', assetController.getById);
assetRouter.put('/:id', assetController.update);
assetRouter.delete('/:id', (req, res) => res.status(405).json({ error: 'Soft delete not allowed. Use status update instead.' }));
//# sourceMappingURL=assetRoutes.js.map