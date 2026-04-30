/*
 Deve conter as funções que recebem a requisição (req, res), 
 Validam os dados básicos e chamam o OrderService
*/
import type { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from '../services/OrderService'

// ─── tipos das rotas ──────────────────────────────────────────────────────────

type IdParam    = { Params: { id: string } }
type SearchQuery = { Querystring: { q?: string } }

// ─── controller ───────────────────────────────────────────────────────────────

export const OrderController = {
  /** GET /orders?q=termo */
  async getAll(req: FastifyRequest<SearchQuery>, rep: FastifyReply) {
    try {
      const orders = await OrderService.getAll(req.query.q)
      return rep.send(orders)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  /** GET /orders/:id */
  async getById(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      const order = await OrderService.getById(req.params.id)
      return rep.send(order)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  /** POST /orders */
  async create(req: FastifyRequest, rep: FastifyReply) {
    try {
      const order = await OrderService.create(req.body)
      return rep.status(201).send(order)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  /** PATCH /orders/:id/status */
  async updateStatus(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      const order = await OrderService.updateStatus(req.params.id, req.body)
      return rep.send(order)
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  /** DELETE /orders/:id */
  async delete(req: FastifyRequest<IdParam>, rep: FastifyReply) {
    try {
      await OrderService.delete(req.params.id)
      return rep.status(204).send()
    } catch (err: any) {
      return rep.status(err.statusCode ?? 500).send({ error: err.message })
    }
  },

  /** GET /dashboard */
  async getDashboard(_req: FastifyRequest, rep: FastifyReply) {
    try {
      const metrics = await OrderService.getDashboardMetrics()
      return rep.send(metrics)
    } catch (err: any) {
      return rep.status(500).send({ error: err.message })
    }
  },
}
