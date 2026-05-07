import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import pedidosDaPasta from "../mocks/pedidos.json";
import type { Order } from "../types";

const USAR_MOCK = true;

interface PedidoMock {
  id: string;
  cliente: string;
  status: string;
  total: number;
  itens: string[];
}

export function usePedidos() {
  const queryClient = useQueryClient();
  const role = useAuthStore((state) => state.user?.role);

  const query = useQuery({
    queryKey: ["pedidos", role],
    enabled: role === "operador",
    queryFn: async () => {
      if (USAR_MOCK) {
        return (pedidosDaPasta as PedidoMock[]).map(
          (p): Order => ({
            id: p.id,
            customerName: p.cliente, 
            customerPhone: "", 
            
            status:
              p.status === "preparacao"
                ? "em_preparo"
                : p.status === "novo"
                  ? "recebido"
                  : p.status === "forno"
                    ? "pronto"
                    : "recebido",
            total: p.total,
            type: "delivery",
            
            items: p.itens.map((itemStr) => ({
              name: itemStr,
              quantity: 1,
              price: 0,
            })),
          }),
        );
      }

      const { data } = await api.get<Order[]>("/orders");
      return data;
    },
    refetchInterval: USAR_MOCK ? false : 15_000,
    refetchIntervalInBackground: true,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Order["status"];
    }) => {
      if (USAR_MOCK) {
        console.log(`Mock: Pedido ${id} → ${status}`);
        return;
      }
      return api.patch(`/orders/${id}/status`, { status });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });

  return {
    pedidos: (query.data ?? []) as Order[],
    isLoading: query.isLoading,
    isError: query.isError,
    updateStatus: mutation.mutate,
  };
}
