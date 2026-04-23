import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.CORS_ORIGIN
})

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.log('Servidor rodando na porta 3333')
})