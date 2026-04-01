import { TaggedError } from 'better-result';
export class NotFoundError extends TaggedError('NotFoundError')() {
    constructor(args) {
        super({ ...args, message: `${args.entity} with ID ${args.id} not found` });
    }
}
export class ValidationError extends TaggedError('ValidationError')() {
    constructor(args) {
        super(args);
    }
}
export class UnauthorizedError extends TaggedError('UnauthorizedError')() {
    constructor(args) {
        super(args);
    }
}
export class InternalError extends TaggedError('InternalError')() {
    constructor(args) {
        super(args);
    }
}
//# sourceMappingURL=errors.js.map