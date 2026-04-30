import type { FastifyInstance } from 'fastify'
import { OrderController } from '../controllers/OrderController'

export async function orderRoutes(app: FastifyInstance) {
  // Dashboard — antes de /orders/:id para não conflitar
  app.get('/dashboard', OrderController.getDashboard)

  // CRUD de pedidos
  app.get('/orders',            OrderController.getAll)
  app.get('/orders/:id',        OrderController.getById)
  app.post('/orders',           OrderController.create)
  app.patch('/orders/:id/status', OrderController.updateStatus)
  app.delete('/orders/:id',     OrderController.delete)
}
