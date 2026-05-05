import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../services/AuthService'

export async function authenticate(
  req: FastifyRequest,
  rep: FastifyReply
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return rep.status(401).send({ error: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    req.user = decoded
  } catch {
    return rep.status(401).send({ error: 'Token inválido ou expirado' })
  }
}

export async function authorizeOperator(
  req: FastifyRequest,
  rep: FastifyReply
) {
  await authenticate(req, rep)

  if (req.user?.role !== 'operador') {
    return rep.status(403).send({ error: 'Acesso restrito a operadores' })
  }
}