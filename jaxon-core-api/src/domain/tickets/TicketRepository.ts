/**
 * TicketRepository Interface
 * Contract for persisting and querying Ticket aggregates
 * Implements Repository pattern (domain-driven design)
 */

import { Ticket } from './Ticket';

export interface TicketRepository {
  /**
   * Save a new ticket or update existing
   */
  save(ticket: Ticket): Promise<void>;

  /**
   * Find ticket by ID
   */
  findById(id: string): Promise<Ticket | null>;

  /**
   * Find all tickets for a given asset
   */
  findByAssetId(assetId: string): Promise<Ticket[]>;

  /**
   * Find all tickets with given status
   */
  findByStatus(status: string): Promise<Ticket[]>;

  /**
   * Find all pending approvals (PENDING_APPROVAL status)
   */
  findPendingApprovals(): Promise<Ticket[]>;

  /**
   * Find all tickets (with optional pagination)
   */
  findAll(limit?: number, offset?: number): Promise<Ticket[]>;

  /**
   * Find all tickets assigned to a specific TECH user
   */
  findByAssignedTech(techId: string): Promise<Ticket[]>;

  /**
   * Count total tickets
   */
  count(): Promise<number>;

  /**
   * Delete ticket (soft delete - mark as CLOSED)
   */
  delete(id: string): Promise<void>;
}
