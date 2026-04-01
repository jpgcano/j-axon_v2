import { TaggedError } from 'better-result';

export class NotFoundError extends TaggedError('NotFoundError')<{
  entity: string;
  id: string;
  message: string;
}>() {
  constructor(args: { entity: string; id: string }) {
    super({ ...args, message: `${args.entity} with ID ${args.id} not found` });
  }
}

export class ValidationError extends TaggedError('ValidationError')<{
  field: string;
  message: string;
}>() {
  constructor(args: { field: string; message: string }) {
    super(args);
  }
}

export class UnauthorizedError extends TaggedError('UnauthorizedError')<{
  message: string;
}>() {
  constructor(args: { message: string }) {
    super(args);
  }
}

export class InternalError extends TaggedError('InternalError')<{
  message: string;
  cause?: unknown;
}>() {
  constructor(args: { message: string; cause?: unknown }) {
    super(args);
  }
}
