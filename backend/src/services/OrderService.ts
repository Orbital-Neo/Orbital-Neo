import { z } from 'zod'
import { OrderModel } from '../models/OrderModel'
import type { CreateOrderDTO, OrderStatus, UpdateOrderStatusDTO } from '../../../index'

// ─── schemas de validação (Zod) ───────────────────────────────────────────────

const OrderItemSchema = z.object({
  name:      z.string().min(1, 'Nome do item é obrigatório'),
  size:      z.enum(['Pequena', 'Media', 'Grande', 'Familia', '350ml', '600ml', '2L', '300ml', '500ml']),
  quantity:  z.number().int().positive('Quantidade deve ser maior que zero'),
  unitPrice: z.number().positive('Preço deve ser maior que zero'),
})

const CreateOrderSchema = z.object({
  customerName:  z.string().min(2, 'Nome do cliente é obrigatório'),
  customerPhone: z.string().min(8, 'Telefone inválido'),
  type:          z.enum(['delivery', 'retirada']),
  items:         z.array(OrderItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  notes:         z.string().optional(),
})

const UpdateStatusSchema = z.object({
  status: z.enum(['recebido', 'em_preparo', 'pronto', 'saiu_para_entrega', 'concluido']),
})

// ─── service ──────────────────────────────────────────────────────────────────

export const OrderService = {
  async getAll(search?: string) {
    if (search && search.trim().length > 0) {
      return OrderModel.search(search.trim())
    }
    return OrderModel.findAll()
  },

  async getById(id: string) {
    const order = await OrderModel.findById(id)
    if (!order) throw { statusCode: 404, message: 'Pedido não encontrado' }
    return order
  },

  async create(body: unknown) {
    const parsed = CreateOrderSchema.safeParse(body)
    if (!parsed.success) {
      throw { statusCode: 400, message: parsed.error.issues[0].message }
    }
    return OrderModel.create(parsed.data as CreateOrderDTO)
  },

  async updateStatus(id: string, body: unknown) {
    const parsed = UpdateStatusSchema.safeParse(body)
    if (!parsed.success) {
      throw { statusCode: 400, message: parsed.error.issues[0].message }
    }
    const exists = await OrderModel.findById(id)
    if (!exists) throw { statusCode: 404, message: 'Pedido não encontrado' }

    return OrderModel.updateStatus(id, parsed.data.status as OrderStatus)
  },

  async delete(id: string) {
    const exists = await OrderModel.findById(id)
    if (!exists) throw { statusCode: 404, message: 'Pedido não encontrado' }
    await OrderModel.delete(id)
  },

  async getDashboardMetrics() {
    return OrderModel.getDashboardMetrics()
  },
}
