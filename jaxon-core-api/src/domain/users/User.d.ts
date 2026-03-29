export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    TECH = "TECH",
    AUDITOR = "AUDITOR"
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
export declare class User {
    private props;
    constructor(props: UserProps);
    get id(): string;
    get email(): string;
    get passwordHash(): string;
    get role(): UserRole;
    get isActive(): boolean;
    deactivate(): void;
    activate(): void;
    changeRole(newRole: UserRole): void;
    private validateEmail;
    toPrimitives(): UserProps;
}
//# sourceMappingURL=User.d.ts.map