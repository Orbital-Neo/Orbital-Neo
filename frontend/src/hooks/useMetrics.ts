import { useQuery } from '@tanstack/react-query';
import api from '../services/api';


const USAR_MOCK = true

export interface RankingSabor {
  sabor: string;
  quantidade: number;
}

export interface Metrics {
  totalVendido: number;        //
  tempoMedioMinutos: number;   // 
  rankingSabores: RankingSabor[]; // 
}

const metricsMock: Metrics = {
  totalVendido: 1250.00,
  tempoMedioMinutos: 22,
  rankingSabores: [
    { sabor: 'Calabresa', quantidade: 15 },
    { sabor: 'Marguerita', quantidade: 12 },
    { sabor: 'Portuguesa', quantidade: 10 },
    { sabor: 'Frango com Catupiry', quantidade: 8 },
    { sabor: 'Quatro Queijos', quantidade: 5 },
  ],
};

export function useMetrics() {
  return useQuery<Metrics>({
    queryKey: ['metrics'],
    queryFn: async () => {
      if (USAR_MOCK) return metricsMock;
      
      // A rota '/dashboard' bate com o DashboardController do Jorge
      const { data } = await api.get<Metrics>('/dashboard');
      return data;
    },
    // Polling configurado para manter a pizzaria atualizada
    refetchInterval: USAR_MOCK ? false : 30000, 
  });
}