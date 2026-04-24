import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- BUSCA DE DADOS ---
async function fetchPedidos() {
  const response = await fetch('http://localhost:3333/orders'); 
  if (!response.ok) throw new Error('Erro ao buscar pedidos');
  return response.json();
}

// --- ATUALIZAÇÃO DE STATUS (Mutação) ---
async function updatePedidoStatus({ id, status }: { id: string; status: string }) {
  const response = await fetch(`http://localhost:3333/orders/${id}`, {
    method: 'PATCH', // Usamos PATCH para atualizações parciais
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Erro ao atualizar status');
  return response.json();
}

export function usePedidos() {
  const queryClient = useQueryClient();

  // Hook de Leitura
  const query = useQuery({
    queryKey: ['pedidos'],
    queryFn: fetchPedidos,
    refetchInterval: 15000, 
  });

  // Hook de Escrita (Mutação)
  const mutation = useMutation({
    mutationFn: updatePedidoStatus,
    // quando a mutação termina, avisamos o TanStack 
    // para atualizar a lista de pedidos na hora!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });

  return { ...query, updateStatus: mutation.mutate };
}