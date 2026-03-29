import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetController } from '../AssetController.js';
import { z } from 'zod';
describe('AssetController Integration', () => {
    let assetController;
    let createAssetMock;
    let listAssetsMock;
    let getAssetMock;
    let updateAssetMock;
    beforeEach(() => {
        createAssetMock = { execute: vi.fn() };
        listAssetsMock = { execute: vi.fn() };
        getAssetMock = { execute: vi.fn() };
        updateAssetMock = { execute: vi.fn() };
        assetController = new AssetController(createAssetMock, listAssetsMock, getAssetMock, updateAssetMock);
    });
    describe('create', () => {
        it('should return 201 and asset data on success', async () => {
            const mockAsset = {
                props: { id: 'asset-1', description: 'Test' },
                toPrimitives: () => ({ id: 'asset-1', description: 'Test' }),
            };
            createAssetMock.execute.mockResolvedValue(mockAsset);
            const req = {
                body: { description: 'Test', category: 'PC' },
                user: { id: 'user-1' },
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.create(req, res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
        });
        it('should return 401 if user context missing', async () => {
            const req = {
                body: { description: 'Test', category: 'PC' },
                user: undefined,
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.create(req, res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(401);
        });
        it('should validate schema and pass actorId', async () => {
            const mockAsset = {
                props: { id: 'asset-1' },
                toPrimitives: () => ({ id: 'asset-1' }),
            };
            createAssetMock.execute.mockResolvedValue(mockAsset);
            const req = {
                body: { description: 'Test Asset', category: 'SERVER' },
                user: { id: 'user-123' },
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.create(req, res, vi.fn());
            expect(createAssetMock.execute).toHaveBeenCalledWith(expect.objectContaining({
                description: 'Test Asset',
                category: 'SERVER',
                actorId: 'user-123',
            }));
        });
    });
    describe('list', () => {
        it('should return 200 and array of assets', async () => {
            const mockAssets = [
                {
                    props: { id: 'asset-1' },
                    toPrimitives: () => ({ id: 'asset-1' }),
                },
            ];
            listAssetsMock.execute.mockResolvedValue(mockAssets);
            const req = {};
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.list(req, res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });
    describe('getById', () => {
        it('should return 200 and asset data', async () => {
            const mockAsset = {
                props: { id: 'asset-1' },
                toPrimitives: () => ({ id: 'asset-1', description: 'Test' }),
            };
            getAssetMock.execute.mockResolvedValue(mockAsset);
            const req = { params: { id: 'asset-1' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.getById(req, res, vi.fn());
            expect(getAssetMock.execute).toHaveBeenCalledWith('asset-1');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe('update', () => {
        it('should return 200 and updated asset', async () => {
            const mockAsset = {
                props: { id: 'asset-1', description: 'Updated' },
                toPrimitives: () => ({ id: 'asset-1', description: 'Updated' }),
            };
            updateAssetMock.execute.mockResolvedValue(mockAsset);
            const req = {
                params: { id: 'asset-1' },
                body: { description: 'Updated' },
                user: { id: 'user-1' },
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.update(req, res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(200);
            expect(updateAssetMock.execute).toHaveBeenCalled();
        });
        it('should return 401 if user context missing on update', async () => {
            const req = {
                params: { id: 'asset-1' },
                body: { description: 'Updated' },
                user: undefined,
            };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            await assetController.update(req, res, vi.fn());
            expect(res.status).toHaveBeenCalledWith(401);
        });
    });
});
//# sourceMappingURL=AssetController.spec.js.map