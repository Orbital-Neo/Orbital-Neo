import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export interface ItemCardapio {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'pizza' | 'bebida' | 'sobremesa';
  disponivel: boolean;
}

const cardapioMock: ItemCardapio[] = [
  { id: '1', nome: 'Calabresa', descricao: 'Calabresa fatiada, cebola e azeitona', preco: 45.9, categoria: 'pizza', disponivel: true },
  { id: '2', nome: 'Marguerita', descricao: 'Molho, mussarela e manjericão fresco', preco: 42.9, categoria: 'pizza', disponivel: true },
  { id: '3', nome: 'Quatro Queijos', descricao: 'Mussarela, parmesão, catupiry e gorgonzola', preco: 52.9, categoria: 'pizza', disponivel: true },
  { id: '4', nome: 'Coca-Cola 2L', descricao: 'Gelada', preco: 12.0, categoria: 'bebida', disponivel: true },
];

const USAR_MOCK = true;

export function useCardapio() {
  const role = useAuthStore((state) => state.user?.role);

  return useQuery<ItemCardapio[]>({
    queryKey: ['cardapio'],
    enabled: role === 'cliente',
    queryFn: async () => {
      if (USAR_MOCK) return cardapioMock;
      const { data } = await api.get<ItemCardapio[]>('/menu');
      return data;
    },
    refetchInterval: USAR_MOCK ? false : 60_000,
    staleTime: 30_000,
  });
}