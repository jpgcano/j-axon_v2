import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceService } from '../services/MaintenanceService';
import type { CreateMaintenanceRequest, UpdateMaintenanceStatusRequest } from '../services/MaintenanceService';

export function useMaintenances() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: MaintenanceService.getMaintenances,
  });
}

export function useMaintenance(id: string) {
  return useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => MaintenanceService.getMaintenanceById(id),
    enabled: !!id,
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaintenanceRequest) => MaintenanceService.createMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
}

export function useUpdateMaintenanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaintenanceStatusRequest }) => 
      MaintenanceService.updateStatus(id, data),
    onSuccess: (data: any, variables: { id: string; data: UpdateMaintenanceStatusRequest }) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', variables.id] });
    },
  });
}
