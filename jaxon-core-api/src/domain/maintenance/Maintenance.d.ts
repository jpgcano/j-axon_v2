export declare enum MaintenanceType {
    PREVENTIVE = "PREVENTIVE",
    CORRECTIVE = "CORRECTIVE"
}
export declare enum MaintenanceStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export interface MaintenanceProps {
    id: string;
    assetId: string;
    ticketId: string | null;
    type: MaintenanceType;
    description: string;
    scheduledDate: Date;
    completedDate: Date | null;
    status: MaintenanceStatus;
    assignedTechId: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Maintenance {
    private props;
    constructor(props: MaintenanceProps);
    get id(): string;
    get assetId(): string;
    get status(): MaintenanceStatus;
    get type(): MaintenanceType;
    updateStatus(newStatus: MaintenanceStatus, updatedBy: string): void;
    toPrimitives(): MaintenanceProps;
}
//# sourceMappingURL=Maintenance.d.ts.map