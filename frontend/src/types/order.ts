export type OrderStatus =
  | "novo"
  | "preparacao"
  | "forno"
  | "rota"
  | "concluido"

export type OrderType = "delivery" | "retirada"

export type OrderItem = {
  id: number
  nome: string
  quantidade: number
}

export type Order = {
  id: number
  status: OrderStatus
  tipo: OrderType
  criadoEm: string // ISO
  itens: OrderItem[]
  observacao?: string
}