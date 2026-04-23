// Status do pedido 
export type OrderStatus =
  | 'recebido'
  | 'em_preparo'
  | 'pronto'
  | 'saiu_para_entrega'
  | 'concluido';

// delivery  → estimatedAt = createdAt + 40 min
// retirada  → estimatedAt = createdAt + 25 min
export type OrderType = 'delivery' | 'retirada';

// Item individual dentro de um pedido
export interface OrderItem {
  id: string;
  name: string;
  size: 'Pequena' | 'Media' | 'Grande' | 'Familia';
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;                 // UUID gerado pelo backend
  number: number;             // Numero sequencial do pedido (#001, #002...)
  // customerName: string;       // Nome do cliente
  // customerPhone: string;      // Telefone do cliente
  type: OrderType;            // delivery ou retirada
  status: OrderStatus;        // Coluna atual no Kanban
  items: OrderItem[];         // Lista de pizzas do pedido
  total: number;              // soma de quantity * unitPrice
  estimatedAt: string;        // Calculado pelo backend (ISO 8601)
  isLate: boolean;            // Calculado pelo backend — prazo estourado?
  minutesRemaining: number;   // Calculado pelo backend — negativo se atrasado
  notes?: string;             // Observacoes opcionais
  createdAt: string;
  updatedAt: string;
}

// Metricas retornadas por GET /dashboard
// Todos os valores sao calculados no backend — o frontend so exibe
export interface DashboardMetrics {
  openOrders: number;           // Pedidos com status != 'concluido'
  completedOrders: number;      // Pedidos concluidos hoje
  lateOrders: number;           // Pedidos onde isLate === true
  totalOrdersToday: number;     // Total de pedidos criados hoje
  avgCompletionMinutes: number; // Tempo medio em minutos entre criacao e conclusao
}

// Payload do POST /orders — dados enviados para criar um novo pedido
export interface CreateOrderDTO {
  customerName: string;
  customerPhone: string;
  type: OrderType;
  items: Omit<OrderItem, 'id'>[];  // id e gerado pelo backend
  notes?: string;
}

// Payload do PATCH /orders/:id/status — usado pelo drag & drop do Kanban
export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}