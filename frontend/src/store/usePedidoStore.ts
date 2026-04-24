import { create } from 'zustand';

interface PedidoState {
  pedidoSelecionadoId: string | null;
  setPedidoSelecionado: (id: string | null) => void;
}

export const usePedidoStore = create<PedidoState>((set) => ({
  pedidoSelecionadoId: null,
  setPedidoSelecionado: (id) => set({ pedidoSelecionadoId: id }),
}));