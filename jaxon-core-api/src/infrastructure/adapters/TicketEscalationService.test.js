import { test, expect, describe } from 'vitest';
import { TicketEscalationService } from './TicketEscalationService.js';
describe('TicketEscalationService - Regla de Negocio 02', () => {
    test('debe escalar tickets de riesgo ALTO que superen las 4 horas', async () => {
        const now = new Date();
        const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
        let updateCalled = false;
        const mockRepo = {
            findPendingHighRisk: async () => [
                { id: 'ticket-1', createdAt: fiveHoursAgo, metadata: {} }
            ],
            update: async (id, data) => {
                updateCalled = true;
                expect(id).toBe('ticket-1');
                expect(data.assignedTo).toBe('CRO_ROLE_ID');
                expect(data.metadata.reason).toBe('SLA_EXCEEDED');
            }
        };
        const mockAudit = { logAction: async () => { } };
        const service = new TicketEscalationService(mockRepo, mockAudit);
        const count = await service.processPendingEscalations();
        expect(count).toBe(1);
        expect(updateCalled).toBe(true);
    });
    test('no debe escalar tickets creados hace menos de 4 horas', async () => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        const mockRepo = {
            findPendingHighRisk: async () => [
                { id: 'ticket-recent', createdAt: oneHourAgo, metadata: {} }
            ],
            update: async () => { throw new Error('No debería llamarse'); }
        };
        const mockAudit = { logAction: async () => { } };
        const service = new TicketEscalationService(mockRepo, mockAudit);
        const count = await service.processPendingEscalations();
        expect(count).toBe(0);
    });
});
//# sourceMappingURL=TicketEscalationService.test.js.map