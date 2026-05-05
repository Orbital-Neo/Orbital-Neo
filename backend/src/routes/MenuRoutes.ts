import { FastifyInstance, RouteHandlerMethod } from 'fastify'
import { db } from '../db'

export async function menuRoutes(app: FastifyInstance) {
  const getMenu: RouteHandlerMethod = async (req, rep) => {
    try {
      const items = await db.menuItem.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }, { price: 'asc' }],
      })
      
      return rep.send(items)
    } catch (error) {
      // Registra o erro no console interno para você debugar se precisar
      req.log.error(error) 
      // Retorna um status 500 elegante para o frontend em vez de quebrar a API
      return rep.status(500).send({ error: 'Erro interno ao buscar o cardápio.' })
    }
  }

  app.get('/menu', getMenu)
}