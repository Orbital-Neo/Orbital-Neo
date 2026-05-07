export type OrderStatus = 'recebido' | 'em_preparo' | 'pronto' | 'saiu_para_entrega' | 'concluido';
export type OrderType = 'delivery' | 'retirada';
export type UserRole = 'cliente' | 'operador';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available?: boolean;
  imageUrl?: string;
  size?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  status: OrderStatus;
  type: OrderType;
  total: number;
  items: OrderItem[];
  timeInStatus?: string;
}

// DTOs para as funções da API
export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  type: OrderType;
  items: OrderItem[];
}

export interface DashboardMetrics {
  openOrders: number;
  completedOrders: number;
  lateOrders: number;
  totalOrdersToday: number;
  avgCompletionMinutes: number;
}

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