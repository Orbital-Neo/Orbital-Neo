import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/AuthRoutes'
import { menuRoutes } from './routes/MenuRoutes'


const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.CORS_ORIGIN
})

app.register(authRoutes)

app.register(menuRoutes)


app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.log('Servidor rodando na porta 3333')
})