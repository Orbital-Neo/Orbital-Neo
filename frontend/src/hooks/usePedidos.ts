import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pedidosMock from '../mocks/pedidos.json';

// 1. A DEFINIÇÃO QUE ESTÁ FALTANDO:
export interface Pedido {
  id: string;
  cliente: string;
  status: 'novo' | 'preparacao' | 'forno' | 'rota' | 'concluido';
  total: number;
  itens: string[];
}

// 2. FUNÇÃO DE BUSCA (USANDO OS DADOS DE MENTIRA)
async function fetchPedidos(): Promise<Pedido[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return pedidosMock as Pedido[]; 
}

// 3. FUNÇÃO DE ATUALIZAÇÃO (MUTATION)
async function updatePedidoStatus({ id, status }: { id: string; status: string }) {
  // Por enquanto ela não faz nada real, só simula sucesso
  console.log(`Atualizando pedido ${id} para o status ${status}`);
  return { id, status };
}

// 4. O HOOK PRINCIPAL
export function usePedidos() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pedidos'],
    queryFn: fetchPedidos,
    refetchInterval: 15000, 
  });

  const mutation = useMutation({
    mutationFn: updatePedidoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });

  return {
    pedidos: (query.data ?? []) as Pedido[],
    isLoading: query.isLoading,
    isError: query.isError,
    updateStatus: mutation.mutate,
  };
}