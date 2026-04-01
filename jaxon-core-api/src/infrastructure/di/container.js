import { AuditLoggerAdapter } from '../adapters/AuditLoggerAdapter.js';
import { RiskAssessmentService } from '../../RiskAssessmentService.js';
// Mock Repositories for demonstration (In production these use Prisma adapters)
// const prisma = new PrismaClient(); 
export const auditRepository = {
    getLastEntry: async () => null,
    recordAction: async (data) => console.log('[Audit] Action recorded', data),
    findAll: async () => []
};
export const ticketRepository = {
    findById: async (id) => null,
    save: async (data) => ({ ...data, id: 'uuid' }),
    update: async (id, data) => ({ id, ...data }),
    findPendingHighRisk: async () => []
};
export const assetRepository = {
    findById: async (id) => null,
    save: async (data) => ({ ...data, id: 'uuid' }),
    update: async (id, data) => ({ id, ...data }),
    findAll: async () => []
};
// Infrastructure Adapters
export const auditLogger = new AuditLoggerAdapter(auditRepository);
export const riskAssessmentService = new RiskAssessmentService();
// Application Use Cases (Asset)
export const createAsset = { execute: async (p) => ({ toPrimitives: () => p }) };
export const listAssets = { execute: async () => [] };
export const getAsset = { execute: async (id) => ({ toPrimitives: () => ({ id }) }) };
export const updateAsset = { execute: async (p) => ({ toPrimitives: () => p }) };
export const assignAsset = { execute: async (p) => ({ toPrimitives: () => p }) };
export const updateAssetStatus = { execute: async (p) => ({ toPrimitives: () => p }) };
export const unassignAsset = { execute: async (p) => ({ toPrimitives: () => p }) };
// Application Use Cases (Ticket)
export const createTicket = { execute: async (p) => ({ toPrimitives: () => p }) };
export const listTickets = { execute: async () => [] };
export const getTicket = { execute: async (id) => ({ toPrimitives: () => ({ id }) }) };
export const updateTicketStatus = { execute: async (p) => ({ toPrimitives: () => p }) };
export const closeTicket = { execute: async (p) => ({ toPrimitives: () => p }) };
export const assignTicket = { execute: async (p) => ({ toPrimitives: () => p }) };
// Application Use Cases (User) - Necesarios para evitar fallos de inicialización en rutas
export const registerUser = { execute: async (p) => ({ toPrimitives: () => p }) };
export const activateUser = { execute: async (p) => ({ toPrimitives: () => p }) };
export const deactivateUser = { execute: async (p) => ({ toPrimitives: () => p }) };
export const authenticateUser = { execute: async (p) => ({ toPrimitives: () => p }) };
export const userController = { deactivate: async () => { }, activate: async () => { }, register: async () => { } };
//# sourceMappingURL=container.js.map