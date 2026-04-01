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
export declare enum TicketStatusEnum {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare class TicketStatus {
    private readonly value;
    constructor(value: TicketStatusEnum);
    static pendingApproval(): TicketStatus;
    static approved(): TicketStatus;
    static inProgress(): TicketStatus;
    static resolved(): TicketStatus;
    static closed(): TicketStatus;
    static fromString(value: string): TicketStatus;
    /**
     * Check if ticket is locked (requires approval to make changes)
     */
    isLocked(): boolean;
    /**
     * Check if ticket is in terminal state (cannot be modified)
     */
    isTerminal(): boolean;
    /**
     * Check if ticket is ready for assignment
     */
    isReadyForWork(): boolean;
    /**
     * Check if ticket is actively being worked on
     */
    isActive(): boolean;
    /**
     * Get display label (for UI)
     */
    getLabel(): string;
    /**
     * Get display color (for UI Badge component)
     */
    getColor(): 'blue' | 'green' | 'yellow' | 'orange' | 'gray';
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
    canTransitionByRole(userRole: 'ADMIN' | 'MANAGER' | 'TECH' | 'AUDITOR'): boolean;
    getValue(): TicketStatusEnum;
    equals(other: TicketStatus): boolean;
    toString(): string;
}
//# sourceMappingURL=TicketStatus.d.ts.map