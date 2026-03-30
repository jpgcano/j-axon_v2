export class DomainException extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainException';
    this.code = code;
  }
}

export class NotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with ID ${id} not found`, 'NOT_FOUND');
    this.name = 'NotFoundException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
  }
}

export class InvalidArgumentException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_ARGUMENT');
    this.name = 'InvalidArgumentException';
  }
}

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictException';
  }
}
