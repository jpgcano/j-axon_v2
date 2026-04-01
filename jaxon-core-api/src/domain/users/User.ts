export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECH = 'TECH',
  AUDITOR = 'AUDITOR',
}

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validateEmail(props.email);
    this.props = props;
  }

  // Getters
  get id(): string { return this.props.id; }
  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get role(): UserRole { return this.props.role; }
  get isActive(): boolean { return this.props.isActive; }

  // Domain Logic
  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public changeRole(newRole: UserRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  // Private validations
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  // Reconstitute from persistence (or view)
  public toPrimitives(): UserProps {
    return { ...this.props };
  }
}
