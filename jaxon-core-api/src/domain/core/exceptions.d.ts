export declare class DomainException extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
export declare class NotFoundException extends DomainException {
    constructor(entity: string, id: string);
}
export declare class UnauthorizedException extends DomainException {
    constructor(message?: string);
}
export declare class InvalidArgumentException extends DomainException {
    constructor(message: string);
}
export declare class ConflictException extends DomainException {
    constructor(message: string);
}
//# sourceMappingURL=exceptions.d.ts.map