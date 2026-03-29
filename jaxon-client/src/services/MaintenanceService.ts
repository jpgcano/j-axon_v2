import { api } from '../lib/api';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Maintenance {
  id: string;
  assetId: string;
  ticketId: string | null;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate: Date | null;
  status: MaintenanceStatus;
  assignedTechId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaintenanceRequest {
  assetId: string;
  ticketId?: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string; // ISO string 
}

export interface UpdateMaintenanceStatusRequest {
  status: MaintenanceStatus;
}

export const MaintenanceService = {
  getMaintenances: () => api.get<Maintenance[]>('/maintenance'),
  getMaintenanceById: (id: string) => api.get<Maintenance>(`/maintenance/${id}`),
  createMaintenance: (data: CreateMaintenanceRequest) => api.post<Maintenance>('/maintenance', data),
  updateStatus: (id: string, data: UpdateMaintenanceStatusRequest) => api.patch<Maintenance>(`/maintenance/${id}/status`, data),
};
