import { test, expect, describe } from 'vitest';
import { AuditLoggerAdapter } from './AuditLoggerAdapter.js';
describe('AuditLoggerAdapter', () => {
    test('debe mapear correctamente los datos y llamar al servicio de auditoría', async () => {
        let called = false;
        const mockService = {
            getLastEntry: async () => ({
                hashCurrent: 'previous-hash-123',
                id: '1',
                timestamp: new Date()
            }),
            recordAction: async (data) => {
                called = true;
                expect(data.entityName).toBe('assets');
                expect(data.action).toBe('CREATE');
                expect(data.actorId).toBe('user-123');
                expect(data.hashPrev).toBe('previous-hash-123');
                expect(typeof data.hashCurrent).toBe('string');
            }
        };
        const adapter = new AuditLoggerAdapter(mockService);
        const action = {
            entityTable: 'assets',
            entityId: 'uuid-1',
            actionType: 'CREATE',
            actorId: 'user-123',
            ipOrigin: '127.0.0.1',
            payloadBefore: null,
            payloadAfter: { name: 'New Asset' }
        };
        await adapter.logAction(action);
        expect(called).toBe(true);
    });
    test('debe lanzar un error específico si el servicio falla', async () => {
        const mockService = {
            getLastEntry: async () => null,
            recordAction: async () => {
                throw new Error('DB Connection Error');
            }
        };
        const adapter = new AuditLoggerAdapter(mockService);
        const action = {
            entityTable: 'assets',
            entityId: 'uuid-1',
            actionType: 'CREATE',
            actorId: 'user-123',
            ipOrigin: '127.0.0.1'
        };
        await expect(adapter.logAction(action)).rejects.toThrow('FAILED_TO_RECORD_AUDIT');
    });
});
//# sourceMappingURL=AuditLoggerAdapter.test.js.map