import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { DashboardMetrics } from '../types';

const USAR_MOCK = true;

const metricsMock: DashboardMetrics = {
  openOrders: 18,
  completedOrders: 42,
  lateOrders: 7,
  totalOrdersToday: 64,
  avgCompletionMinutes: 38,
};

export function useMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['metrics'],
    queryFn: async () => {
      if (USAR_MOCK) return metricsMock;
      const { data } = await api.get<DashboardMetrics>('/dashboard');
      return data;
    },
    refetchInterval: USAR_MOCK ? false : 30_000,
    refetchIntervalInBackground: true,
  });
}