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
import { RiskLevel } from './value-objects/RiskLevel.js';
import { TicketStatus } from './value-objects/TicketStatus.js';
export class Ticket {
    id;
    assetId;
    description;
    probability;
    consequence;
    riskLevel;
    createdBy;
    createdAt;
    // Mutable fields
    status;
    assignedTechId;
    approvedById;
    updatedBy;
    updatedAt;
    constructor(id, assetId, description, probability, consequence, createdBy, status = TicketStatus.pendingApproval(), assignedTechId = null, approvedById = null, updatedBy = createdBy, createdAt = new Date(), updatedAt = new Date()) {
        // Validation
        if (!id || id.trim().length === 0)
            throw new Error('Ticket ID cannot be empty');
        if (!assetId || assetId.trim().length === 0)
            throw new Error('Asset ID cannot be empty');
        if (!description || description.trim().length === 0)
            throw new Error('Description cannot be empty');
        if (!createdBy || createdBy.trim().length === 0)
            throw new Error('CreatedBy cannot be empty');
        if (probability < 1 || probability > 5)
            throw new Error('Probability must be between 1-5');
        if (consequence < 1 || consequence > 5)
            throw new Error('Consequence must be between 1-5');
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
            throw new Error(`Ticket with risk level ${this.riskLevel.getValue()} must start in PENDING_APPROVAL status`);
        }
    }
    /**
     * Factory method: Create a new ticket
     */
    static create(id, assetId, description, probability, consequence, createdBy) {
        const riskLevel = RiskLevel.calculateFromMatrix(probability, consequence);
        const initialStatus = riskLevel.requiresApproval()
            ? TicketStatus.pendingApproval()
            : TicketStatus.approved();
        return new Ticket(id, assetId, description, probability, consequence, createdBy, initialStatus);
    }
    /**
     * Factory method: Reconstruct from database
     */
    static reconstruct(data) {
        return new Ticket(data.id, data.assetId, data.description, data.probability, data.consequence, data.createdBy, TicketStatus.fromString(data.status), data.assignedTechId, data.approvedById, data.updatedBy, data.createdAt, data.updatedAt);
    }
    /**
     * Approve ticket (update status to APPROVED)
     */
    approve(approverId, updatedBy) {
        if (!this.status.equals(TicketStatus.pendingApproval())) {
            throw new Error(`Cannot approve ticket. Current status is ${this.status.getValue()}, expected PENDING_APPROVAL`);
        }
        this.status = TicketStatus.approved();
        this.approvedById = approverId;
        this.updatedBy = updatedBy;
        this.updatedAt = new Date();
    }
    /**
     * Assign ticket to a TECH user
     */
    assignToTech(techId, updatedBy) {
        if (!this.status.equals(TicketStatus.approved())) {
            throw new Error(`Cannot assign ticket. Status is ${this.status.getValue()}, must be APPROVED`);
        }
        this.status = TicketStatus.inProgress();
        this.assignedTechId = techId;
        this.updatedBy = updatedBy;
        this.updatedAt = new Date();
    }
    /**
     * Change ticket status
     */
    changeStatus(newStatus, userRole, updatedBy) {
        if (!this.status.canTransitionByRole(userRole)) {
            throw new Error(`User role ${userRole} cannot transition from ${this.status.getValue()} status`);
        }
        if (newStatus.equals(TicketStatus.pendingApproval())) {
            throw new Error('Cannot set status to PENDING_APPROVAL after creation');
        }
        this.status = newStatus;
        this.updatedBy = updatedBy;
        this.updatedAt = new Date();
    }
    /**
     * Close ticket (terminal state)
     */
    close(updatedBy) {
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
    canBeModifiedBy(userRole) {
        if (userRole === 'ADMIN')
            return true;
        if (userRole === 'AUDITOR')
            return false;
        if (this.status.isLocked() || this.riskLevel.requiresApproval()) {
            return userRole === 'MANAGER';
        }
        return userRole === 'MANAGER' || userRole === 'TECH';
    }
    // Getters
    getId() { return this.id; }
    getAssetId() { return this.assetId; }
    getDescription() { return this.description; }
    getProbability() { return this.probability; }
    getConsequence() { return this.consequence; }
    getRiskLevel() { return this.riskLevel; }
    getStatus() { return this.status; }
    getAssignedTechId() { return this.assignedTechId; }
    getApprovedById() { return this.approvedById; }
    getCreatedBy() { return this.createdBy; }
    getUpdatedBy() { return this.updatedBy; }
    getCreatedAt() { return this.createdAt; }
    getUpdatedAt() { return this.updatedAt; }
    /**
     * Convert to primitive values
     */
    toPrimitives() {
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
//# sourceMappingURL=Ticket.js.map