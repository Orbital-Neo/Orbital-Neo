import { db } from '../db'
import type { CreateOrderDTO, OrderStatus } from '../../../index'

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Calcula estimatedAt com base no tipo do pedido */
function calcEstimatedAt(type: 'delivery' | 'retirada', createdAt: Date): Date {
  const minutes = type === 'delivery' ? 40 : 25
  return new Date(createdAt.getTime() + minutes * 60_000)
}

/** Calcula campos derivados de tempo (não persistidos) */
export function calcTimeFields(estimatedAt: Date, now = new Date()) {
  const minutesRemaining = Math.round((estimatedAt.getTime() - now.getTime()) / 60_000)
  return {
    minutesRemaining,
    isLate: minutesRemaining < 0,
  }
}

/** Formata um pedido do banco adicionando campos calculados */
function formatOrder(order: any) {
  const { minutesRemaining, isLate } = calcTimeFields(order.estimatedAt)
  return {
    ...order,
    estimatedAt: order.estimatedAt.toISOString(),
    createdAt:   order.createdAt.toISOString(),
    updatedAt:   order.updatedAt.toISOString(),
    minutesRemaining,
    isLate,
  }
}

// ─── include padrão ───────────────────────────────────────────────────────────

const WITH_ITEMS = { items: true } as const

// ─── queries ──────────────────────────────────────────────────────────────────

export const OrderModel = {
  /** Lista todos os pedidos, mais recentes primeiro */
  async findAll() {
    const orders = await db.order.findMany({
      include: WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
    })
    return orders.map(formatOrder)
  },

  /** Busca por nome ou telefone do cliente (case-insensitive) */
  async search(query: string) {
    const orders = await db.order.findMany({
      where: {
        OR: [
          { customerName:  { contains: query, mode: 'insensitive' } },
          { customerPhone: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
    })
    return orders.map(formatOrder)
  },

  /** Busca um pedido pelo id */
  async findById(id: string) {
    const order = await db.order.findUnique({ where: { id }, include: WITH_ITEMS })
    if (!order) return null
    return formatOrder(order)
  },

  /** Cria pedido + itens em uma transação. Calcula total e estimatedAt. */
  async create(data: CreateOrderDTO) {
    const now = new Date()
    const estimatedAt = calcEstimatedAt(data.type, now)

    const total = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    )

    const order = await db.order.create({
      data: {
        customerName:  data.customerName,
        customerPhone: data.customerPhone,
        type:          data.type,
        notes:         data.notes ?? null,
        total,
        estimatedAt,
        items: {
          create: data.items.map((item) => ({
            name:      item.name,
            size:      item.size,
            quantity:  item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: WITH_ITEMS,
    })

    return formatOrder(order)
  },

  /** Atualiza somente o status (usado pelo drag & drop do Kanban) */
  async updateStatus(id: string, status: OrderStatus) {
    const order = await db.order.update({
      where:   { id },
      data:    { status },
      include: WITH_ITEMS,
    })
    return formatOrder(order)
  },

  /** Remove um pedido (e seus itens via CASCADE) */
  async delete(id: string) {
    await db.order.delete({ where: { id } })
  },

  /** Métricas para o Dashboard — tudo calculado no backend */
  async getDashboardMetrics() {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [openOrders, completedToday, allToday, concluded] = await Promise.all([
      db.order.count({ where: { status: { not: 'concluido' } } }),
      db.order.count({
        where: { status: 'concluido', updatedAt: { gte: startOfDay } },
      }),
      db.order.count({ where: { createdAt: { gte: startOfDay } } }),
      db.order.findMany({
        where: { status: 'concluido', updatedAt: { gte: startOfDay } },
        select: { createdAt: true, updatedAt: true },
      }),
    ])

    const avgCompletionMinutes =
      concluded.length === 0
        ? 0
        : Math.round(
            concluded.reduce(
              (sum, o) =>
                sum + (o.updatedAt.getTime() - o.createdAt.getTime()) / 60_000,
              0,
            ) / concluded.length,
          )

    const lateOrders = await db.order.count({
      where: {
        status:      { not: 'concluido' },
        estimatedAt: { lt: new Date() },
      },
    })

    return {
      openOrders,
      completedOrders:      completedToday,
      lateOrders,
      totalOrdersToday:     allToday,
      avgCompletionMinutes,
    }
  },
}
