import { Router } from 'express';
import { AssetController } from './AssetController.js';
import { createAsset, listAssets, getAsset, updateAsset, assignAsset, updateAssetStatus, unassignAsset, auditLogger, assetRepository } from '../../infrastructure/di/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/requireRole.js';
import { AssetActionsController } from './assetActionsController.js';
import { AnullationAssetService } from '../../AnullationAssetService.js';
export const assetRouter = Router();
// Protect all asset routes with authentication
assetRouter.use(authMiddleware);
const assetController = new AssetController(createAsset, listAssets, getAsset, updateAsset, assignAsset, updateAssetStatus, unassignAsset);
const assetActionsController = new AssetActionsController(new AnullationAssetService(assetRepository, auditLogger));
assetRouter.post('/', assetController.create);
assetRouter.get('/', assetController.list);
assetRouter.get('/:id', assetController.getById);
assetRouter.put('/:id', requireRole(['ADMIN', 'MANAGER']), assetController.update);
assetRouter.patch('/:id/assign', requireRole(['ADMIN', 'MANAGER']), assetController.assign);
assetRouter.patch('/:id/unassign', requireRole(['ADMIN', 'MANAGER']), assetController.unassign);
assetRouter.patch('/:id/status', requireRole(['ADMIN', 'MANAGER']), assetController.updateStatus);
assetRouter.patch('/:id/void', requireRole(['ADMIN', 'MANAGER']), assetActionsController.voidAsset);
assetRouter.delete('/:id', (req, res) => res.status(405).json({ error: 'Soft delete not allowed. Use status update instead.' }));
//# sourceMappingURL=assetRoutes.js.map