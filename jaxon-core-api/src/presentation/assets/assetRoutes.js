import { Router } from 'express';
import { AssetController } from './AssetController.js';
import { createAsset, listAssets, getAsset } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
export const assetRouter = Router();
// Protect all asset routes with authentication
assetRouter.use(authMiddleware);
const assetController = new AssetController(createAsset, listAssets, getAsset);
assetRouter.post('/', assetController.create);
assetRouter.get('/', assetController.list);
assetRouter.get('/:id', assetController.getById);
//# sourceMappingURL=assetRoutes.js.map