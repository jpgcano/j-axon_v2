import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssetService } from '../services/AssetService';
import type { CreateAssetRequest } from '../services/AssetService';

export function useAssets() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: AssetService.getAssets,
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => AssetService.getAssetById(id),
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssetRequest) => AssetService.createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAssetRequest> }) => AssetService.updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}
