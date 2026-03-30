import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTicket } from '../CreateTicket.js';
import { TicketStatus, RiskLevel } from '../../../domain/tickets/Ticket.js';
describe('CreateTicket', () => {
    let ticketRepository;
    let wsService;
    let createTicket;
    beforeEach(() => {
        ticketRepository = { save: vi.fn().mockResolvedValue(undefined) };
        wsService = { emitEvent: vi.fn() };
        const auditService = { recordAction: vi.fn() };
        createTicket = new CreateTicket(ticketRepository, wsService, auditService);
    });
    it('should create a ticket and emit websocket event', async () => {
        const request = {
            assetId: 'asset-uuid',
            issueDescription: 'Server overheating',
            riskLevel: RiskLevel.HIGH,
            actorId: 'user-uuid',
        };
        const ticket = await createTicket.execute(request);
        expect(ticket.toPrimitives().status).toBe(TicketStatus.OPEN);
        expect(ticketRepository.save).toHaveBeenCalled();
        expect(wsService.emitEvent).toHaveBeenCalledWith('ticket:created', expect.anything());
    });
});
//# sourceMappingURL=CreateTicket.spec.js.map