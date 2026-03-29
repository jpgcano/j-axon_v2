import type { TicketStatus } from '../../domain/tickets/Ticket.js';
import { Ticket } from '../../domain/tickets/Ticket.js';
import type { TicketRepository } from '../../domain/tickets/TicketRepository.js';
export interface UpdateTicketStatusRequest {
    id: string;
    status: TicketStatus;
    actorId: string;
}
export declare class UpdateTicketStatus {
    private readonly ticketRepository;
    constructor(ticketRepository: TicketRepository);
    execute(request: UpdateTicketStatusRequest): Promise<Ticket>;
}
//# sourceMappingURL=UpdateTicketStatus.d.ts.map