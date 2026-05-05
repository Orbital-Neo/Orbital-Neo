
import type { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from '../services/OrderService'

type IdParam    = { Params: { id: string } }
type SearchQuery = { Querystring: { q?: string } }

export const OrderController = {
  async getAll(req: FastifyRequest<SearchQuery>, rep: FastifyReply) {
    try {
      const orders = await OrderService.getAll(req.query.q)
      return rep.send(orders)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  async getById(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      const order = await OrderService.getById(req.params.id)
      return rep.send(order)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  async create(req: FastifyRequest, rep: FastifyReply) {
    try {
      const userId = (req as any).user?.id; 
      const orderData = { ...(req.body as object), userId };

      const order = await OrderService.create(orderData);
      return rep.status(201).send(order);
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message });
    }
  },

  async updateStatus(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      const order = await OrderService.updateStatus(req.params.id, req.body)
      return rep.send(order)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  async delete(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      await OrderService.delete(req.params.id)
      return rep.status(204).send()
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  async getDashboard(_req: FastifyRequest, rep: FastifyReply) {
    try {
      const metrics = await OrderService.getDashboardMetrics()
      return rep.send(metrics)
    } catch (err: any) {
      return rep.status(500).send({ error: err.message })
    }
  },
}
