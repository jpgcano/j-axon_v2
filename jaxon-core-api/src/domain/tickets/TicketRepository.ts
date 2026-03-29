import { Ticket, TicketStatus } from './Ticket.js';

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  findByAssetId(assetId: string): Promise<Ticket[]>;
  findByStatus(status: TicketStatus): Promise<Ticket[]>;
  findByAssignedTech(techId: string): Promise<Ticket[]>;
}
