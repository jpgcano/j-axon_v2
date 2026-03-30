import { test, expect, describe } from 'vitest';
import { AssetController } from './AssetController.js';
import { AssetStatus } from '../../domain/assets/Asset.js';

describe('AssetController', () => {
  const mockCreateAsset: any = {
    execute: async (payload: any) => ({
      toPrimitives: () => ({ ...payload, id: 'asset-uuid' })
    })
  };

  const controller = new AssetController(
    mockCreateAsset,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any
  );

  test('create debe retornar 201 y el activo creado', async () => {
    const req: any = {
      body: {
        description: 'Compresor Industrial XL',
        category: 'Maquinaria Pesada',
        status: AssetStatus.ACTIVE
      },
      user: { id: 'admin-001' }
    };

    const res: any = {
      status: (code: number) => {
        expect(code).toBe(201);
        return { json: (data: any) => {
          expect(data.description).toBe('Compresor Industrial XL');
          expect(data.id).toBe('asset-uuid');
        }};
      }
    };

    await controller.create(req, res, () => {});
  });

  test('create debe fallar si no hay contexto de usuario (401)', async () => {
    const req: any = { body: {}, user: null };
    const res: any = {
      status: (code: number) => { expect(code).toBe(401); return { json: () => {} }; }
    };
    await controller.create(req, res, () => {});
  });
});