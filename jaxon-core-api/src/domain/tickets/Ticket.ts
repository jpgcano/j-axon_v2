/**
 * Ticket Aggregate Root
 * 
 * Domain Entity representing an incident/ticket in the system.
 * Implements Domain-Driven Design Aggregate pattern.
 * 
 * Responsibilities:
 * - Encapsulate ticket state and lifecycle
 * - Validate business rules (ERM matrix, status transitions)
 * - Enforce RBAC for state transitions
 * 
 * ERM (Enterprise Risk Model):
 * - Probability: 1-5 (likelihood)
 * - Consequence: 1-5 (impact)
 * - Risk = P × C → [1,25]
 * - Result: LOW (1-5), MEDIUM (6-12), HIGH (13-20), EXTREME (21-25)
 */

import { RiskLevel } from './value-objects/RiskLevel';
import { TicketStatus } from './value-objects/TicketStatus';

export interface TicketPrimitives {
  id: string;
  assetId: string;
  description: string;
  probability: number;
  consequence: number;
  riskLevel: string;
  status: string;
  assignedTechId: string | null;
  approvedById: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Ticket {
  private readonly id: string;
  private readonly assetId: string;
  private readonly description: string;
  private readonly probability: number;
  private readonly consequence: number;
  private readonly riskLevel: RiskLevel;
  private readonly createdBy: string;
  private readonly createdAt: Date;

  // Mutable fields
  private status: TicketStatus;
  private assignedTechId: string | null;
  private approvedById: string | null;
  private updatedBy: string;
  private updatedAt: Date;

  constructor(
    id: string,
    assetId: string,
    description: string,
    probability: number,
    consequence: number,
    createdBy: string,
    status: TicketStatus = TicketStatus.pendingApproval(),
    assignedTechId: string | null = null,
    approvedById: string | null = null,
    updatedBy: string = createdBy,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    // Validation
    if (!id || id.trim().length === 0) throw new Error('Ticket ID cannot be empty');
    if (!assetId || assetId.trim().length === 0) throw new Error('Asset ID cannot be empty');
    if (!description || description.trim().length === 0) throw new Error('Description cannot be empty');
    if (!createdBy || createdBy.trim().length === 0) throw new Error('CreatedBy cannot be empty');
    if (probability < 1 || probability > 5) throw new Error('Probability must be between 1-5');
    if (consequence < 1 || consequence > 5) throw new Error('Consequence must be between 1-5');

    this.id = id;
    this.assetId = assetId;
    this.description = description;
    this.probability = probability;
    this.consequence = consequence;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.status = status;
    this.assignedTechId = assignedTechId;
    this.approvedById = approvedById;
    this.updatedBy = updatedBy;
    this.updatedAt = updatedAt;

    // Calculate risk level
    this.riskLevel = RiskLevel.calculateFromMatrix(probability, consequence);

    // Enforce business rule: HIGH/EXTREME must start with PENDING_APPROVAL
    if (this.riskLevel.requiresApproval() && !status.equals(TicketStatus.pendingApproval())) {
      throw new Error(
        `Ticket with risk level ${this.riskLevel.getValue()} must start in PENDING_APPROVAL status`
      );
    }
  }

  /**
   * Factory method: Create a new ticket
   */
  static create(
    id: string,
    assetId: string,
    description: string,
    probability: number,
    consequence: number,
    createdBy: string
  ): Ticket {
    const riskLevel = RiskLevel.calculateFromMatrix(probability, consequence);
    const initialStatus = riskLevel.requiresApproval() 
      ? TicketStatus.pendingApproval() 
      : TicketStatus.approved();

    return new Ticket(
      id,
      assetId,
      description,
      probability,
      consequence,
      createdBy,
      initialStatus
    );
  }

  /**
   * Factory method: Reconstruct from database
   */
  static reconstruct(data: TicketPrimitives): Ticket {
    return new Ticket(
      data.id,
      data.assetId,
      data.description,
      data.probability,
      data.consequence,
      data.createdBy,
      TicketStatus.fromString(data.status),
      data.assignedTechId,
      data.approvedById,
      data.updatedBy,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Approve ticket (update status to APPROVED)
   */
  approve(approverId: string, updatedBy: string): void {
    if (!this.status.equals(TicketStatus.pendingApproval())) {
      throw new Error(
        `Cannot approve ticket. Current status is ${this.status.getValue()}, expected PENDING_APPROVAL`
      );
    }

    this.status = TicketStatus.approved();
    this.approvedById = approverId;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Assign ticket to a TECH user
   */
  assignToTech(techId: string, updatedBy: string): void {
    if (!this.status.equals(TicketStatus.approved())) {
      throw new Error(
        `Cannot assign ticket. Status is ${this.status.getValue()}, must be APPROVED`
      );
    }

    this.status = TicketStatus.inProgress();
    this.assignedTechId = techId;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Change ticket status
   */
  changeStatus(newStatus: TicketStatus, userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR', updatedBy: string): void {
    if (!this.status.canTransitionByRole(userRole)) {
      throw new Error(`User role ${userRole} cannot transition from ${this.status.getValue()} status`);
    }

    this.status = newStatus;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Close ticket (terminal state)
   */
  close(updatedBy: string): void {
    if (this.status.isTerminal()) {
      throw new Error('Ticket is already closed');
    }

    this.status = TicketStatus.closed();
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Check if ticket can be modified
   */
  canBeModifiedBy(userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR'): boolean {
    if (userRole === 'ADMIN') return true;
    if (userRole === 'AUDITOR') return false;
    if (this.status.isLocked() || this.riskLevel.requiresApproval()) {
      return userRole === 'MANAGER';
    }
    return userRole === 'MANAGER' || userRole === 'TECH';
  }

  // Getters
  getId(): string { return this.id; }
  getAssetId(): string { return this.assetId; }
  getDescription(): string { return this.description; }
  getProbability(): number { return this.probability; }
  getConsequence(): number { return this.consequence; }
  getRiskLevel(): RiskLevel { return this.riskLevel; }
  getStatus(): TicketStatus { return this.status; }
  getAssignedTechId(): string | null { return this.assignedTechId; }
  getApprovedById(): string | null { return this.approvedById; }

  /**
   * Convert to primitive values
   */
  toPrimitives(): TicketPrimitives {
    return {
      id: this.id,
      assetId: this.assetId,
      description: this.description,
      probability: this.probability,
      consequence: this.consequence,
      riskLevel: this.riskLevel.getValue(),
      status: this.status.getValue(),
      assignedTechId: this.assignedTechId,
      approvedById: this.approvedById,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
