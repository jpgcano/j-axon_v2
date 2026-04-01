import { api } from '../lib/api';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Ticket {
  id: string;
  issueDescription: string;
  status: TicketStatus;
  inherentRiskLevel: RiskLevel;
  assetId: string;
  assignedTechId: string | null;
  approvedById: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTicketRequest {
  issueDescription: string;
  assetId: string;
  inherentRiskLevel?: RiskLevel;
}

export interface UpdateTicketStatusRequest {
  status: TicketStatus;
}

export const TicketService = {
  getTickets: () => api.get<Ticket[]>('/tickets'),
  getTicketById: (id: string) => api.get<Ticket>(`/tickets/${id}`),
  createTicket: (data: CreateTicketRequest) => api.post<Ticket>('/tickets', data),
  updateStatus: (id: string, data: UpdateTicketStatusRequest) => api.patch<Ticket>(`/tickets/${id}/status`, data),
};
