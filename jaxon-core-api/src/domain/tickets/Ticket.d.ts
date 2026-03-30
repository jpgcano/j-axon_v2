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
export declare class Ticket {
    private readonly id;
    private readonly assetId;
    private readonly description;
    private readonly probability;
    private readonly consequence;
    private readonly riskLevel;
    private readonly createdBy;
    private readonly createdAt;
    private status;
    private assignedTechId;
    private approvedById;
    private updatedBy;
    private updatedAt;
    constructor(id: string, assetId: string, description: string, probability: number, consequence: number, createdBy: string, status?: TicketStatus, assignedTechId?: string | null, approvedById?: string | null, updatedBy?: string, createdAt?: Date, updatedAt?: Date);
    /**
     * Factory method: Create a new ticket
     */
    static create(id: string, assetId: string, description: string, probability: number, consequence: number, createdBy: string): Ticket;
    /**
     * Factory method: Reconstruct from database
     */
    static reconstruct(data: TicketPrimitives): Ticket;
    /**
     * Approve ticket (update status to APPROVED)
     */
    approve(approverId: string, updatedBy: string): void;
    /**
     * Assign ticket to a TECH user
     */
    assignToTech(techId: string, updatedBy: string): void;
    /**
     * Change ticket status
     */
    changeStatus(newStatus: TicketStatus, userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR', updatedBy: string): void;
    /**
     * Close ticket (terminal state)
     */
    close(updatedBy: string): void;
    /**
     * Check if ticket can be modified
     */
    canBeModifiedBy(userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR'): boolean;
    getId(): string;
    getAssetId(): string;
    getDescription(): string;
    getProbability(): number;
    getConsequence(): number;
    getRiskLevel(): RiskLevel;
    getStatus(): TicketStatus;
    getAssignedTechId(): string | null;
    getApprovedById(): string | null;
    /**
     * Convert to primitive values
     */
    toPrimitives(): TicketPrimitives;
}
//# sourceMappingURL=Ticket.d.ts.map