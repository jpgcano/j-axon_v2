import { test, expect, describe } from 'vitest';
import { AnullationAssetService } from '../../AnullationAssetService.js';

describe('AnullationAssetService', () => {
  test('debe marcar el activo como VOIDED y registrar el motivo en auditoría', async () => {
    const assetId = 'asset-123';
    const reason = 'Error de tipografía';
    const actorId = 'admin-01';

    const mockAsset = { id: assetId, status: 'ACTIVE', metadata: {} };
    let auditCalled = false;

    const mockRepo: any = {
      findById: async (id: string) => (id === assetId ? mockAsset : null),
      update: async (id: string, data: any) => {
        expect(data.status).toBe('VOIDED');
        expect(data.metadata.void_reason).toBe(reason);
        return { ...mockAsset, ...data };
      }
    };

    const mockAudit: any = {
      logAction: async (action: any) => {
        auditCalled = true;
        expect(action.actionType).toBe('VOID_BY_ERROR');
        expect(action.payloadBefore).toBeDefined();
        expect(action.payloadAfter.status).toBe('VOIDED');
      }
    };

    const service = new AnullationAssetService(mockRepo, mockAudit);
    await service.voidAsset(assetId, reason, actorId, '127.0.0.1');

    expect(auditCalled).toBe(true);
  });
});