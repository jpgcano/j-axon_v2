export class NotFoundError extends Error {
  public readonly entity: string;
  public readonly id: string;

  constructor(args: { entity: string; id: string }) {
    super(`${args.entity} with ID ${args.id} not found`);
    this.name = 'NotFoundError';
    this.entity = args.entity;
    this.id = args.id;
  }
}

export class ValidationError extends Error {
  public readonly field: string;

  constructor(args: { field: string; message: string }) {
    super(args.message);
    this.name = 'ValidationError';
    this.field = args.field;
  }
}

export class UnauthorizedError extends Error {
  constructor(args: { message: string }) {
    super(args.message);
    this.name = 'UnauthorizedError';
  }
}

export class InternalError extends Error {
  public readonly cause?: unknown;

  constructor(args: { message: string; cause?: unknown }) {
    super(args.message);
    this.name = 'InternalError';
    this.cause = args.cause;
  }
}
