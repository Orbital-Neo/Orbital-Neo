import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api }  from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import pedidosDaPasta from '../mocks/pedidos.json';

const USAR_MOCK = true;

export interface Pedido {
  id: string;
  customerName: string;
  status: 'recebido' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'concluido';
  total: number;
  type: 'delivery' | 'retirada';
  itens?: string[];
}

export function usePedidos() {
  const queryClient = useQueryClient();
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ['pedidos', role],
    enabled: role === 'operador',
    queryFn: async () => {
      if (USAR_MOCK) {
        return pedidosDaPasta.map((p: any) => ({
          ...p,
          customerName: p.customerName ?? p.cliente,
          status: p.status === 'preparacao' ? 'em_preparo' : p.status,
        })) as Pedido[];
      }

      const { data } = await api.get<Pedido[]>('/orders');
      return data;
    },
    refetchInterval: USAR_MOCK ? false : 15_000,
    refetchIntervalInBackground: true,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Pedido['status'] }) => {
      if (USAR_MOCK) {
        console.log(`Mock: Pedido ${id} → ${status}`);
        return;
      }
      return api.patch(`/orders/${id}/status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  });

  return {
    pedidos: (query.data ?? []) as Pedido[],
    isLoading: query.isLoading,
    isError: query.isError,
    updateStatus: mutation.mutate,
  };
}