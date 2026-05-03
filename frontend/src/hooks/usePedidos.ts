import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api'; 
// IMPORTANTE: Importando os pedidos que você localizou na pasta mocks
import pedidosDaPasta from '../mocks/pedidos.json';

//  - Deixei  true até o backend estar 100%
const USAR_MOCK = true;

export interface Pedido {
  id: string;
  customerName: string; 
  status: 'recebido' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'concluido'; 
  total: number;
  type: 'delivery' | 'retirada';
}

export function usePedidos() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => {
      if (USAR_MOCK) {
        // Mapeia o JSON para garantir que o campo 'cliente' apareça como 'customerName'
        return pedidosDaPasta.map((p: any) => ({
          ...p,
          customerName: p.customerName || p.cliente, // Aceita os dois formatos
          status: p.status === 'preparacao' ? 'em_preparo' : p.status // Ajusta status se necessário
        })) as Pedido[];
      }
      
      // Rota do Jeferson (Ativar quando o banco estiver pronto)
      const { data } = await api.get<Pedido[]>('/orders'); 
      return data;
    },
    // Refetch desligado no Mock para economizar processamento; 5s no Real
    refetchInterval: USAR_MOCK ? false : 5000, 
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Pedido['status'] }) => {
      if (USAR_MOCK) return console.log(`Mock: Pedido ${id} movido para ${status}`);
      
      // Rota de atualização do Jeferson
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