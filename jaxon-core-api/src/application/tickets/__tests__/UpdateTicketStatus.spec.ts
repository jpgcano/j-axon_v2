import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTicketStatus } from '../UpdateTicketStatus.js';
import { TicketStatus, RiskLevel } from '../../../domain/tickets/index.js';

describe('UpdateTicketStatus', () => {
  let ticketRepository: any;
  let wsService: any;
  let updateTicketStatus: UpdateTicketStatus;

  beforeEach(() => {
    ticketRepository = { 
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined) 
    };
    wsService = { emitEvent: vi.fn() };
    const auditService = { logAction: vi.fn() } as any;
    updateTicketStatus = new UpdateTicketStatus(ticketRepository, auditService);
  });

  it('should prevent TECH from resolving EXTREME tickets', async () => {
    const ticketMock = {
      toPrimitives: () => ({ id: '123', riskLevel: 'EXTREME', status: 'PENDING_APPROVAL' }),
      changeStatus: vi.fn().mockImplementation(() => {
         throw new Error('Insufficient privileges to resolve EXTREME risk tickets');
      }),
    };
    ticketRepository.findById.mockResolvedValue(ticketMock);

    await expect(updateTicketStatus.execute({
      id: '123',
      status: TicketStatus.resolved(),
      actorId: 'tech-id',
      userRole: 'TECH'
    })).rejects.toThrow('Insufficient privileges to resolve EXTREME risk tickets');
  });

  it('should allow resolving if role is ADMIN', async () => {
    const ticketMock = {
      toPrimitives: () => ({ id: '123', riskLevel: 'EXTREME', status: 'PENDING_APPROVAL' }),
      changeStatus: vi.fn(),
      save: vi.fn()
    };
    // Mocking toPrimitives again after save simulation
    const updatedTicketMock = {
       toPrimitives: () => ({ id: '123', riskLevel: 'EXTREME', status: 'RESOLVED' })
    };
    
    ticketRepository.findById.mockResolvedValue(ticketMock);
    ticketRepository.save.mockResolvedValue(updatedTicketMock);

    await updateTicketStatus.execute({
      id: '123',
      status: TicketStatus.resolved(),
      actorId: 'admin-id',
      userRole: 'ADMIN'
    });

    expect(ticketRepository.save).toHaveBeenCalled();
  });
});
