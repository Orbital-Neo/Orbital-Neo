import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { orderRoutes } from './routes/OrderRoutes'
import { authRoutes } from './routes/AuthRoutes'
import { menuRoutes } from './routes/MenuRoutes'


const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? '*',
})


app.register(orderRoutes, { prefix: '/api' })
app.register(authRoutes)
app.register(menuRoutes)

app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT ?? 3333}`)
})
