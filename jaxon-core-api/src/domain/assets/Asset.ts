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
  private _props: AssetProps;

  constructor(props: AssetProps) {
    this._props = { ...props };
  }

  get id(): string { return this._props.id; }
  get description(): string { return this._props.description; }
  get category(): string { return this._props.category; }
  get status(): AssetStatus { return this._props.status; }
  get assignedTo(): string | null { return this._props.assignedTo; }
  get props(): AssetProps { return { ...this._props }; }

  public changeStatus(newStatus: AssetStatus, updatedBy?: string): void {
    if (!Object.values(AssetStatus).includes(newStatus)) {
      throw new Error(`Invalid asset status: ${newStatus}`);
    }
    this._props.status = newStatus;
    if (updatedBy) {
      this._props.updatedBy = updatedBy;
    }
    this._props.updatedAt = new Date();
  }

  public assignTo(userId: string, updatedBy?: string): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('Assigned user is required');
    }
    this._props.assignedTo = userId;
    if (updatedBy) {
      this._props.updatedBy = updatedBy;
    }
    this._props.updatedAt = new Date();
  }

  public unassign(updatedBy?: string): void {
    this._props.assignedTo = null;
    if (updatedBy) {
      this._props.updatedBy = updatedBy;
    }
    this._props.updatedAt = new Date();
  }

  public toPrimitives(): AssetProps {
    return { ...this._props };
  }
}
