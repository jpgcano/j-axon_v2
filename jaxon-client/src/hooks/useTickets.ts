import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketService } from '../services/TicketService';
import type { CreateTicketRequest, UpdateTicketStatusRequest } from '../services/TicketService';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: TicketService.getTickets,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => TicketService.getTicketById(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => TicketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketStatusRequest }) => 
      TicketService.updateStatus(id, data),
    onSuccess: (data: any, variables: { id: string; data: UpdateTicketStatusRequest }) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
    },
  });
}
