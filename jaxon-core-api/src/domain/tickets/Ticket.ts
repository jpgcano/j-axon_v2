export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
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

export class Ticket {
  private props: TicketProps;

  constructor(props: TicketProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get assetId(): string { return this.props.assetId; }
  get status(): TicketStatus { return this.props.status; }
  get inherentRiskLevel(): RiskLevel { return this.props.inherentRiskLevel; }

  public assignTo(techId: string, updatedBy: string): void {
    this.props.assignedTechId = techId;
    this.props.status = TicketStatus.IN_PROGRESS;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public resolve(updatedBy: string): void {
    this.props.status = TicketStatus.RESOLVED;
    this.props.updatedBy = updatedBy;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): TicketProps {
    return { ...this.props };
  }
}
