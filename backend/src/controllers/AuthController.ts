import type { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../db'
import { hashPassword, comparePassword, generateToken } from '../services/AuthService'

// POST /auth/register — cadastro de novo cliente
export async function register(req: FastifyRequest, rep: FastifyReply) {
  const body = req.body as {
    name: string
    phone: string
    email: string
    password: string
  }

  if (!body.name || !body.email || !body.password || !body.phone) {
    return rep.status(400).send({ error: 'Todos os campos são obrigatórios' })
  }

  if (body.password.length < 6) {
    return rep.status(400).send({ error: 'A senha deve ter no mínimo 6 caracteres' })
  }

  const existing = await db.user.findUnique({ where: { email: body.email } })
  if (existing) {
    return rep.status(409).send({ error: 'Email já cadastrado' })
  }

  const hashedPassword = await hashPassword(body.password)

  const user = await db.user.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      role: 'cliente',
    },
  })

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  return rep.status(201).send({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}

// POST /auth/login — login de cliente ou operador
export async function login(req: FastifyRequest, rep: FastifyReply) {
  const body = req.body as { email: string; password: string }

  if (!body.email || !body.password) {
    return rep.status(400).send({ error: 'Email e senha são obrigatórios' })
  }

  const user = await db.user.findUnique({ where: { email: body.email } })
  if (!user) {
    return rep.status(401).send({ error: 'Email ou senha incorretos' })
  }

  const passwordMatch = await comparePassword(body.password, user.password)
  if (!passwordMatch) {
    return rep.status(401).send({ error: 'Email ou senha incorretos' })
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  return rep.send({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}