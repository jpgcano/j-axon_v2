export class DomainException extends Error {
    code;
    constructor(message, code = 'DOMAIN_ERROR') {
        super(message);
        this.name = 'DomainException';
        this.code = code;
    }
}
export class NotFoundException extends DomainException {
    constructor(entity, id) {
        super(`${entity} with ID ${id} not found`, 'NOT_FOUND');
        this.name = 'NotFoundException';
    }
}
export class UnauthorizedException extends DomainException {
    constructor(message = 'Unauthorized access') {
        super(message, 'UNAUTHORIZED');
        this.name = 'UnauthorizedException';
    }
}
export class InvalidArgumentException extends DomainException {
    constructor(message) {
        super(message, 'INVALID_ARGUMENT');
        this.name = 'InvalidArgumentException';
    }
}
//# sourceMappingURL=exceptions.js.map