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
export declare const CreateTicketRequestSchema: z.ZodObject<{
    assetId: z.ZodString;
    description: z.ZodString;
    probability: z.ZodNumber;
    consequence: z.ZodNumber;
}, z.core.$strip>;
export type CreateTicketRequest = z.infer<typeof CreateTicketRequestSchema>;
export declare const UpdateTicketStatusRequestSchema: z.ZodObject<{
    status: z.ZodEnum<{
        IN_PROGRESS: "IN_PROGRESS";
        RESOLVED: "RESOLVED";
        APPROVED: "APPROVED";
        CLOSED: "CLOSED";
    }>;
}, z.core.$strip>;
export type UpdateTicketStatusRequest = z.infer<typeof UpdateTicketStatusRequestSchema>;
export declare const ApproveTicketRequestSchema: z.ZodObject<{
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ApproveTicketRequest = z.infer<typeof ApproveTicketRequestSchema>;
export declare const GetTicketParamsSchema: z.ZodObject<{
    ticketId: z.ZodString;
}, z.core.$strip>;
export type GetTicketParams = z.infer<typeof GetTicketParamsSchema>;
export declare const ListTicketsQuerySchema: z.ZodObject<{
    riskLevel: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        EXTREME: "EXTREME";
        MEDIUM: "MEDIUM";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING_APPROVAL: "PENDING_APPROVAL";
        IN_PROGRESS: "IN_PROGRESS";
        RESOLVED: "RESOLVED";
        APPROVED: "APPROVED";
        CLOSED: "CLOSED";
    }>>;
    assetId: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    offset: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ListTicketsQuery = z.infer<typeof ListTicketsQuerySchema>;
export declare const TicketResponseSchema: z.ZodObject<{
    id: z.ZodString;
    assetId: z.ZodString;
    description: z.ZodString;
    probability: z.ZodNumber;
    consequence: z.ZodNumber;
    riskLevel: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        EXTREME: "EXTREME";
        MEDIUM: "MEDIUM";
    }>;
    status: z.ZodEnum<{
        PENDING_APPROVAL: "PENDING_APPROVAL";
        IN_PROGRESS: "IN_PROGRESS";
        RESOLVED: "RESOLVED";
        APPROVED: "APPROVED";
        CLOSED: "CLOSED";
    }>;
    assignedTechId: z.ZodNullable<z.ZodString>;
    approvedById: z.ZodNullable<z.ZodString>;
    createdBy: z.ZodString;
    updatedBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type TicketResponse = z.infer<typeof TicketResponseSchema>;
export declare function validateCreateTicketRequest(data: unknown): CreateTicketRequest;
export declare function validateUpdateTicketStatusRequest(data: unknown): UpdateTicketStatusRequest;
export declare function validateApproveTicketRequest(data: unknown): ApproveTicketRequest;
export declare function validateGetTicketParams(data: unknown): GetTicketParams;
export declare function validateListTicketsQuery(data: unknown): ListTicketsQuery;
export declare function validateTicketResponse(data: unknown): TicketResponse;
//# sourceMappingURL=TicketValidators.d.ts.map