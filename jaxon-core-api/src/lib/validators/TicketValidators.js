/**
 * Ticket Input/Output Validation Schemas
 * Using Zod for runtime type checking and validation
 *
 * Validates:
 * - API request bodies (CreateTicketRequest, UpdateTicketStatusRequest)
 * - API response bodies (TicketResponse)
 * - Input parameters passed to use cases
 */
import { z } from 'zod';
// Create Ticket Request
export const CreateTicketRequestSchema = z.object({
    assetId: z.string().uuid('Invalid asset ID format'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),
    probability: z.number()
        .int('Probability must be an integer')
        .min(1, 'Probability must be between 1-5')
        .max(5, 'Probability must be between 1-5'),
    consequence: z.number()
        .int('Consequence must be an integer')
        .min(1, 'Consequence must be between 1-5')
        .max(5, 'Consequence must be between 1-5'),
});
// Update Ticket Status Request
export const UpdateTicketStatusRequestSchema = z.object({
    status: z.enum(['APPROVED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], {
        errorMap: () => ({ message: 'Invalid status. Must be one of: APPROVED, IN_PROGRESS, RESOLVED, CLOSED' }),
    }),
});
// Approve Ticket Request (empty for now, extensible)
export const ApproveTicketRequestSchema = z.object({
    comment: z.string().optional(),
});
// Get Ticket Params
export const GetTicketParamsSchema = z.object({
    ticketId: z.string().uuid('Invalid ticket ID format'),
});
// List Tickets Query Parameters
export const ListTicketsQuerySchema = z.object({
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']).optional(),
    status: z.enum(['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    assetId: z.string().uuid().optional(),
    limit: z.number().int().positive().default(10).optional(),
    offset: z.number().int().nonnegative().default(0).optional(),
    search: z.string().optional(),
});
// Ticket Response (for API responses)
export const TicketResponseSchema = z.object({
    id: z.string().uuid(),
    assetId: z.string().uuid(),
    description: z.string(),
    probability: z.number().int().min(1).max(5),
    consequence: z.number().int().min(1).max(5),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'EXTREME']),
    status: z.enum(['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    assignedTechId: z.string().uuid().nullable(),
    approvedById: z.string().uuid().nullable(),
    createdBy: z.string().uuid(),
    updatedBy: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Validation helper functions
export function validateCreateTicketRequest(data) {
    return CreateTicketRequestSchema.parse(data);
}
export function validateUpdateTicketStatusRequest(data) {
    return UpdateTicketStatusRequestSchema.parse(data);
}
export function validateApproveTicketRequest(data) {
    return ApproveTicketRequestSchema.parse(data);
}
export function validateGetTicketParams(data) {
    return GetTicketParamsSchema.parse(data);
}
export function validateListTicketsQuery(data) {
    return ListTicketsQuerySchema.parse(data);
}
export function validateTicketResponse(data) {
    return TicketResponseSchema.parse(data);
}
//# sourceMappingURL=TicketValidators.js.map