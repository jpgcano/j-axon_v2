import { api } from '../lib/api';

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  status: AssetStatus;
  location: string | null;
  assignedToUser: string | null;
  purchaseDate: Date | null;
  warrantyExpiry: Date | null;
  notes: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetRequest {
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
}

export const AssetService = {
  getAssets: () => api.get<Asset[]>('/assets'),
  getAssetById: (id: string) => api.get<Asset>(`/assets/${id}`),
  createAsset: (data: CreateAssetRequest) => api.post<Asset>('/assets', data),
  updateAsset: (id: string, data: Partial<CreateAssetRequest>) => api.put<Asset>(`/assets/${id}`, data),
};
