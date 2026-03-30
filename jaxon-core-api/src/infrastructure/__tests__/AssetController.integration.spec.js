import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AssetController } from '../../presentation/assets/AssetController.js';
import { errorHandler } from '../../presentation/middlewares/errorHandler.js';
import { NotFoundException } from '../../domain/core/exceptions.js';
describe('AssetController Integration', () => {
    let app;
    let createAssetUseCase;
    let listAssetsUseCase;
    let getAssetUseCase;
    let updateAssetUseCase;
    let assignAssetUseCase;
    let updateAssetStatusUseCase;
    let unassignAssetUseCase;
    beforeEach(() => {
        app = express();
        app.use(express.json());
        // Mock middleware to inject user context
        app.use((req, _res, next) => {
            req.user = { id: 'test-user', role: 'ADMIN' };
            next();
        });
        createAssetUseCase = { execute: vi.fn() };
        listAssetsUseCase = { execute: vi.fn() };
        getAssetUseCase = { execute: vi.fn() };
        updateAssetUseCase = { execute: vi.fn() };
        assignAssetUseCase = { execute: vi.fn() };
        updateAssetStatusUseCase = { execute: vi.fn() };
        unassignAssetUseCase = { execute: vi.fn() };
        const assetController = new AssetController(createAssetUseCase, listAssetsUseCase, getAssetUseCase, updateAssetUseCase, assignAssetUseCase, updateAssetStatusUseCase, unassignAssetUseCase);
        app.get('/api/v1/assets', (req, res, next) => assetController.list(req, res, next));
        app.get('/api/v1/assets/:id', (req, res, next) => assetController.getById(req, res, next));
        app.use(errorHandler);
    });
    it('GET /api/assets returns 200', async () => {
        vi.mocked(listAssetsUseCase.execute).mockResolvedValueOnce([
            { toPrimitives: () => ({ id: 'asset-1' }) },
        ]);
        const response = await request(app).get('/api/v1/assets');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('GET /api/assets/:id returns 404 for non-existent', async () => {
        vi.mocked(getAssetUseCase.execute).mockRejectedValueOnce(new NotFoundException('Asset', 'non-existent'));
        const response = await request(app).get('/api/v1/assets/non-existent');
        expect(response.status).toBe(404);
    });
});
//# sourceMappingURL=AssetController.integration.spec.js.map