export declare enum RiskLevel {
    LOW = "LOW",
    MODERATE = "MODERATE",
    HIGH = "HIGH",
    EXTREME = "EXTREME"
}
export declare enum TicketStatus {
    OPEN = "OPEN",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}
export interface TicketProps {
    id: string;
    assetId: string;
    issueDescription: string;
    inherentRiskLevel: RiskLevel;
    status: TicketStatus;
    assignedTechId: string | null;
    approvedById: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Ticket {
    private props;
    constructor(props: TicketProps);
    get id(): string;
    get assetId(): string;
    get status(): TicketStatus;
    get inherentRiskLevel(): RiskLevel;
    assignTo(techId: string, updatedBy: string): void;
    resolve(updatedBy: string): void;
    toPrimitives(): TicketProps;
}
//# sourceMappingURL=Ticket.d.ts.map