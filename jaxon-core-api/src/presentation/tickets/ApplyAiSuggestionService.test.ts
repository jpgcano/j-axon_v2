import { test, expect, describe } from 'vitest';
import { ApplyAiSuggestionService } from '../../ApplyAiSuggestionService.js';

describe('ApplyAiSuggestionService', () => {
  test('debe aplicar la sugerencia y registrar la auditoría correctamente', async () => {
    const ticketId = 'ticket-123';
    const recommendation = 'Reemplazar rodamiento';
    const actorId = 'tech-01';
    const ipOrigin = '127.0.0.1';

    const mockTicket = { id: ticketId, description: 'Falla', metadata: {} };
    let auditCalled = false;

    const mockRepo: any = {
      findById: async (id: string) => (id === ticketId ? mockTicket : null),
      update: async (id: string, data: any) => ({ ...mockTicket, ...data })
    };

    const mockAudit: any = {
      logAction: async (action: any) => {
        auditCalled = true;
        expect(action.actionType).toBe('IA_SUGGESTION_APPLIED');
        expect(action.entityId).toBe(ticketId);
        expect(action.actorId).toBe(actorId);
      }
    };

    const service = new ApplyAiSuggestionService(mockRepo, mockAudit);
    await service.execute(ticketId, recommendation, actorId, ipOrigin);

    expect(auditCalled).toBe(true);
  });

  test('debe lanzar error si el ticket no existe', async () => {
    const mockRepo: any = { findById: async () => null };
    const mockAudit: any = { logAction: async () => {} };
    const service = new ApplyAiSuggestionService(mockRepo, mockAudit);

    await expect(service.execute('invalid', 'rec', 'user', '127.0.0.1'))
      .rejects.toThrow('TICKET_NOT_FOUND');
  });
});