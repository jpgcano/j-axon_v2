import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AssetController } from '../../presentation/assets/AssetController.js';
import type { CreateAsset } from '../../application/assets/CreateAsset.js';
import type { ListAssets } from '../../application/assets/ListAssets.js';
import type { GetAsset } from '../../application/assets/GetAsset.js';
import type { UpdateAsset } from '../../application/assets/UpdateAsset.js';
import { errorHandler } from '../../presentation/middlewares/errorHandler.js';
import { NotFoundException } from '../../domain/core/exceptions.js';

describe('AssetController Integration', () => {
  let app: express.Application;
  let createAssetUseCase: CreateAsset;
  let listAssetsUseCase: ListAssets;
  let getAssetUseCase: GetAsset;
  let updateAssetUseCase: UpdateAsset;
  let assignAssetUseCase: any;
  let updateAssetStatusUseCase: any;
  let unassignAssetUseCase: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock middleware to inject user context
    app.use((req: any, _res, next) => {
      req.user = { id: 'test-user', role: 'ADMIN' };
      next();
    });

    createAssetUseCase = { execute: vi.fn() } as any;
    listAssetsUseCase = { execute: vi.fn() } as any;
    getAssetUseCase = { execute: vi.fn() } as any;
    updateAssetUseCase = { execute: vi.fn() } as any;
    assignAssetUseCase = { execute: vi.fn() } as any;
    updateAssetStatusUseCase = { execute: vi.fn() } as any;
    unassignAssetUseCase = { execute: vi.fn() } as any;

    const assetController = new AssetController(
      createAssetUseCase,
      listAssetsUseCase,
      getAssetUseCase,
      updateAssetUseCase,
      assignAssetUseCase,
      updateAssetStatusUseCase,
      unassignAssetUseCase
    );

    app.get('/api/v1/assets', (req: any, res, next) => assetController.list(req, res, next));
    app.get('/api/v1/assets/:id', (req: any, res, next) => assetController.getById(req, res, next));

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
    vi.mocked(getAssetUseCase.execute).mockRejectedValueOnce(
      new NotFoundException('Asset', 'non-existent')
    );

    const response = await request(app).get('/api/v1/assets/non-existent');
    expect(response.status).toBe(404);
  });
});
