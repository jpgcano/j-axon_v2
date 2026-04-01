import { AuditLoggerAdapter } from '../adapters/AuditLoggerAdapter.js';
import { RiskAssessmentService } from '../../RiskAssessmentService.js';
export declare const auditRepository: {
    getLastEntry: () => Promise<null>;
    recordAction: (data: any) => Promise<void>;
    findAll: () => Promise<never[]>;
};
export declare const ticketRepository: {
    findById: (id: string) => Promise<null>;
    save: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    findPendingHighRisk: () => Promise<never[]>;
};
export declare const assetRepository: {
    findById: (id: string) => Promise<null>;
    save: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
    findAll: () => Promise<never[]>;
};
export declare const auditLogger: AuditLoggerAdapter;
export declare const riskAssessmentService: RiskAssessmentService;
export declare const createAsset: any;
export declare const listAssets: any;
export declare const getAsset: any;
export declare const updateAsset: any;
export declare const assignAsset: any;
export declare const updateAssetStatus: any;
export declare const unassignAsset: any;
export declare const createTicket: any;
export declare const listTickets: any;
export declare const getTicket: any;
export declare const updateTicketStatus: any;
export declare const closeTicket: any;
export declare const assignTicket: any;
export declare const registerUser: any;
export declare const activateUser: any;
export declare const deactivateUser: any;
export declare const authenticateUser: any;
export declare const userController: any;
//# sourceMappingURL=container.d.ts.map