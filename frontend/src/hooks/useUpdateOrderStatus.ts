// frontend/src/hooks/useUpdateOrderStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api  from '../services/api';
import type { OrderStatus } from '../types';

interface UpdateStatusData {
  orderId: string;
  newStatus: OrderStatus;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: UpdateStatusData) => {
      const response = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: () => {
      // Força a tela a buscar os pedidos atualizados na mesma hora
      queryClient.invalidateQueries({ queryKey: ['pedidos-kanban'] });
    },
  });
}