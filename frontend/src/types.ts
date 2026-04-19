
export type {
  OrderStatus,
  OrderType,
  OrderItem,
  Order,
  DashboardMetrics,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
} from '../../index.ts';

import type { OrderStatus } from '../../index.ts';

// Nome exibido em cada coluna do Kanban
export const COLUMN_LABELS: Record<OrderStatus, string> = {
  recebido:          'Recebido',
  em_preparo:        'Em preparo',
  pronto:            'Pronto',
  saiu_para_entrega: 'Saiu p/ entrega',
  concluido:         'Concluído',
};

// Ordem das colunas da esquerda para a direita
export const COLUMN_ORDER: OrderStatus[] = [
  'recebido',
  'em_preparo',
  'pronto',
  'saiu_para_entrega',
  'concluido',
];

// Próximo status por tipo — retirada pula 'saiu_para_entrega'
export const NEXT_STATUS: Record<OrderStatus, Record<'delivery' | 'retirada', OrderStatus | null>> = {
  recebido:          { delivery: 'em_preparo',        retirada: 'em_preparo' },
  em_preparo:        { delivery: 'pronto',            retirada: 'pronto' },
  pronto:            { delivery: 'saiu_para_entrega', retirada: 'concluido' },
  saiu_para_entrega: { delivery: 'concluido',         retirada: null },
  concluido:         { delivery: null,                retirada: null },
};