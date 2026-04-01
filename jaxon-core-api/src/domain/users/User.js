export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["TECH"] = "TECH";
    UserRole["AUDITOR"] = "AUDITOR";
})(UserRole || (UserRole = {}));
export class User {
    props;
    constructor(props) {
        this.validateEmail(props.email);
        this.props = props;
    }
    // Getters
    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
    get role() { return this.props.role; }
    get isActive() { return this.props.isActive; }
    // Domain Logic
    deactivate() {
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }
    activate() {
        this.props.isActive = true;
        this.props.updatedAt = new Date();
    }
    changeRole(newRole) {
        this.props.role = newRole;
        this.props.updatedAt = new Date();
    }
    // Private validations
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error(`Invalid email format: ${email}`);
        }
    }
    // Reconstitute from persistence (or view)
    toPrimitives() {
        return { ...this.props };
    }
}
//# sourceMappingURL=User.js.map