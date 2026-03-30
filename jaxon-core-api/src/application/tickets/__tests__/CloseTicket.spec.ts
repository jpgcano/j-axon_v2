import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CloseTicket } from '../CloseTicket.js';
import { Ticket } from '../../../domain/tickets/Ticket.js';
import { TicketStatus } from '../../../domain/tickets/value-objects/TicketStatus.js';
import { NotFoundException, InvalidArgumentException } from '../../../domain/core/exceptions.js';

describe('CloseTicket', () => {
  const ticketRepository = {
    findById: vi.fn(),
    save: vi.fn(),
  } as any;

  const auditLogger = {
    logAction: vi.fn(),
  } as any;

  let useCase: CloseTicket;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CloseTicket(ticketRepository, auditLogger);
  });

  it('should close ticket and audit', async () => {
    const ticket = Ticket.create(
      'ticket-1',
      'asset-1',
      'Desc',
      1,
      1,
      'user-1'
    );
    ticket.changeStatus(TicketStatus.approved(), 'MANAGER', 'user-1');

    ticketRepository.findById.mockResolvedValue(ticket);

    await useCase.execute({ id: 'ticket-1', actorId: 'user-2', userRole: 'MANAGER' });

    expect(ticketRepository.save).toHaveBeenCalled();
    expect(auditLogger.logAction).toHaveBeenCalled();
  });

  it('should throw if ticket not found', async () => {
    ticketRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', actorId: 'user-1', userRole: 'ADMIN' })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should throw if role cannot modify', async () => {
    const ticket = Ticket.create(
      'ticket-1',
      'asset-1',
      'Desc',
      1,
      1,
      'user-1'
    );
    ticketRepository.findById.mockResolvedValue(ticket);

    await expect(
      useCase.execute({ id: 'ticket-1', actorId: 'user-1', userRole: 'AUDITOR' })
    ).rejects.toBeInstanceOf(InvalidArgumentException);
  });
});
