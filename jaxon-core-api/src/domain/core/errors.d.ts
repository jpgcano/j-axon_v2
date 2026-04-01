declare const NotFoundError_base: import("better-result").TaggedErrorClass<"NotFoundError", {
    entity: string;
    id: string;
    message: string;
}>;
export declare class NotFoundError extends NotFoundError_base {
    constructor(args: {
        entity: string;
        id: string;
    });
}
declare const ValidationError_base: import("better-result").TaggedErrorClass<"ValidationError", {
    field: string;
    message: string;
}>;
export declare class ValidationError extends ValidationError_base {
    constructor(args: {
        field: string;
        message: string;
    });
}
declare const UnauthorizedError_base: import("better-result").TaggedErrorClass<"UnauthorizedError", {
    message: string;
}>;
export declare class UnauthorizedError extends UnauthorizedError_base {
    constructor(args: {
        message: string;
    });
}
declare const InternalError_base: import("better-result").TaggedErrorClass<"InternalError", {
    message: string;
    cause?: unknown;
}>;
export declare class InternalError extends InternalError_base {
    constructor(args: {
        message: string;
        cause?: unknown;
    });
}
export {};
//# sourceMappingURL=errors.d.ts.map