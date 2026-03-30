/**
 * InvalidTicketError
 * Thrown when a ticket operation violates business rules
 */
export class InvalidTicketError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidTicketError';
        Object.setPrototypeOf(this, InvalidTicketError.prototype);
    }
}
//# sourceMappingURL=InvalidTicketError.js.map