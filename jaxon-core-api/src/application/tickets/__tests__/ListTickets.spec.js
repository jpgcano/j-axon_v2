import { describe, it, expect, vi } from 'vitest';
import { ListTickets } from '../ListTickets.js';
describe('ListTickets', () => {
    it('should list all tickets', async () => {
        const ticketsMock = [{ toPrimitives: () => ({ id: 't1' }) }];
        const ticketRepository = { findAll: vi.fn().mockResolvedValue(ticketsMock) };
        const listTickets = new ListTickets(ticketRepository);
        const result = await listTickets.execute();
        expect(result).toHaveLength(1);
        expect(ticketRepository.findAll).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ListTickets.spec.js.map