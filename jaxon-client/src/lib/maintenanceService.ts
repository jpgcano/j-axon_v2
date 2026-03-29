import { api } from './api';

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
  scheduledDate: string;
  completedDate: string | null;
  status: MaintenanceStatus;
  assignedTechId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const maintenanceService = {
  list: async () => {
    return api.get<Maintenance[]>('/maintenance');
  },

  create: async (payload: Partial<Maintenance>) => {
    return api.post<Maintenance>('/maintenance', payload);
  },

  updateStatus: async (id: string, status: MaintenanceStatus) => {
    return api.patch<Maintenance>(`/maintenance/${id}/status`, { status });
  },
};
