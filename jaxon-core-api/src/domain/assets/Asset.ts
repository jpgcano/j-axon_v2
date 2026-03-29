export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
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

export class Asset {
  private props: AssetProps;

  constructor(props: AssetProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get description(): string { return this.props.description; }
  get category(): string { return this.props.category; }
  get status(): AssetStatus { return this.props.status; }
  get assignedTo(): string | null { return this.props.assignedTo; }

  public changeStatus(newStatus: AssetStatus, updatedBy: string): void {
    this.props.status = newStatus;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public assignTo(userId: string, updatedBy: string): void {
    this.props.assignedTo = userId;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public unassign(updatedBy: string): void {
    this.props.assignedTo = null;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): AssetProps {
    return { ...this.props };
  }
}
