import { test, expect, describe } from 'vitest';
import { AssetActionsController } from './assetActionsController.js';

describe('AssetActionsController', () => {
  test('voidAsset debe procesar la anulación correctamente', async () => {
    const mockService: any = {
      voidAsset: async (id: string, reason: string) => {
        expect(id).toBe('asset-1');
        expect(reason).toBe('Error de ingreso');
      }
    };

    const controller = new AssetActionsController(mockService);
    
    const req: any = {
      params: { id: 'asset-1' },
      body: { reason: 'Error de ingreso' },
      user: { id: 'admin-1' },
      ip: '192.168.1.1'
    };

    const res: any = {
      status: (code: number) => {
        expect(code).toBe(200);
        return {
          json: (data: any) => {
            expect(data.success).toBe(true);
            expect(data.message).toBe('Activo anulado correctamente (Estado: VOIDED).');
          }
        };
      }
    };

    await controller.voidAsset(req, res);
  });
});