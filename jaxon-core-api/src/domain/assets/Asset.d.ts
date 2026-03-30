export declare enum AssetStatus {
    ACTIVE = "ACTIVE",
    MAINTENANCE = "MAINTENANCE",
    RETIRED = "RETIRED"
}
export interface AssetProps {
    id: string;
    description: string;
    category: string;
    status: AssetStatus;
    assignedTo: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Asset {
    private props;
    constructor(props: AssetProps);
    get id(): string;
    get description(): string;
    get category(): string;
    get status(): AssetStatus;
    get assignedTo(): string | null;
    changeStatus(newStatus: AssetStatus, updatedBy: string): void;
    assignTo(userId: string, updatedBy: string): void;
    unassign(updatedBy: string): void;
    toPrimitives(): AssetProps;
}
//# sourceMappingURL=Asset.d.ts.map