/**
 * TicketStatus Value Object
 * Represents the lifecycle state of a ticket (incident)
 *
 * Status Transitions:
 * - PENDING_APPROVAL: Initial state for HIGH/EXTREME risk tickets (requires MANAGER/CRO approval)
 * - APPROVED: Ticket approved by MANAGER/CRO, ready for work
 * - IN_PROGRESS: Tech assigned and working on the issue
 * - RESOLVED: Issue resolved, awaiting final confirmation
 * - CLOSED: Ticket closed and archived
 */
export var TicketStatusEnum;
(function (TicketStatusEnum) {
    TicketStatusEnum["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TicketStatusEnum["APPROVED"] = "APPROVED";
    TicketStatusEnum["IN_PROGRESS"] = "IN_PROGRESS";
    TicketStatusEnum["RESOLVED"] = "RESOLVED";
    TicketStatusEnum["CLOSED"] = "CLOSED";
})(TicketStatusEnum || (TicketStatusEnum = {}));
export class TicketStatus {
    value;
    constructor(value) {
        this.value = value;
    }
    static pendingApproval() {
        return new TicketStatus(TicketStatusEnum.PENDING_APPROVAL);
    }
    static approved() {
        return new TicketStatus(TicketStatusEnum.APPROVED);
    }
    static inProgress() {
        return new TicketStatus(TicketStatusEnum.IN_PROGRESS);
    }
    static resolved() {
        return new TicketStatus(TicketStatusEnum.RESOLVED);
    }
    static closed() {
        return new TicketStatus(TicketStatusEnum.CLOSED);
    }
    static fromString(value) {
        if (!Object.values(TicketStatusEnum).includes(value)) {
            throw new Error(`Invalid TicketStatus: ${value}`);
        }
        return new TicketStatus(value);
    }
    /**
     * Check if ticket is locked (requires approval to make changes)
     */
    isLocked() {
        return this.value === TicketStatusEnum.PENDING_APPROVAL;
    }
    /**
     * Check if ticket is in terminal state (cannot be modified)
     */
    isTerminal() {
        return this.value === TicketStatusEnum.CLOSED;
    }
    /**
     * Check if ticket is ready for assignment
     */
    isReadyForWork() {
        return this.value === TicketStatusEnum.APPROVED;
    }
    /**
     * Check if ticket is actively being worked on
     */
    isActive() {
        return this.value === TicketStatusEnum.IN_PROGRESS;
    }
    /**
     * Get display label (for UI)
     */
    getLabel() {
        const labels = {
            [TicketStatusEnum.PENDING_APPROVAL]: 'Pending Approval',
            [TicketStatusEnum.APPROVED]: 'Approved',
            [TicketStatusEnum.IN_PROGRESS]: 'In Progress',
            [TicketStatusEnum.RESOLVED]: 'Resolved',
            [TicketStatusEnum.CLOSED]: 'Closed',
        };
        return labels[this.value];
    }
    /**
     * Get display color (for UI Badge component)
     */
    getColor() {
        const colors = {
            [TicketStatusEnum.PENDING_APPROVAL]: 'blue',
            [TicketStatusEnum.APPROVED]: 'green',
            [TicketStatusEnum.IN_PROGRESS]: 'yellow',
            [TicketStatusEnum.RESOLVED]: 'orange',
            [TicketStatusEnum.CLOSED]: 'gray',
        };
        return colors[this.value];
    }
    /**
     * Check if user (by role) can change status from current
     * Used in middleware/controller to enforce RBAC
     *
     * Rules:
     * - PENDING_APPROVAL: Only MANAGER/CRO/ADMIN can approve
     * - Other statuses: TECH/MANAGER can change
     *
     * @param userRole User role (from JWT token)
     * @returns true if user can transition from current status
     */
    canTransitionByRole(userRole) {
        if (userRole === 'ADMIN')
            return true;
        if (userRole === 'AUDITOR')
            return false;
        // PENDING_APPROVAL: only MANAGER
        if (this.value === TicketStatusEnum.PENDING_APPROVAL) {
            return userRole === 'MANAGER';
        }
        // Other states: MANAGER or TECH
        return userRole === 'MANAGER' || userRole === 'TECH';
    }
    getValue() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=TicketStatus.js.map