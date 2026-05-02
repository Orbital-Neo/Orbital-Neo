import type { FastifyInstance } from 'fastify'
import { db } from '../db'

export async function menuRoutes(app: FastifyInstance) {
  app.get('/menu', async (req, rep) => {
    const items = await db.menuItem.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }, { price: 'asc' }],
    })
    return rep.send(items)
  })
}