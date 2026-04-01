export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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

export class Maintenance {
  private props: MaintenanceProps;

  constructor(props: MaintenanceProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get assetId(): string { return this.props.assetId; }
  get status(): MaintenanceStatus { return this.props.status; }
  get type(): MaintenanceType { return this.props.type; }

  public updateStatus(newStatus: MaintenanceStatus, updatedBy: string): void {
    if (newStatus === MaintenanceStatus.COMPLETED && this.props.status !== MaintenanceStatus.COMPLETED) {
      this.props.completedDate = new Date();
    }
    this.props.status = newStatus;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): MaintenanceProps {
    return { ...this.props };
  }
}
