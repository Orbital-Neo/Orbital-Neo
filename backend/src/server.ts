import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from './routes/AuthRoutes'
import { menuRoutes } from './routes/MenuRoutes'

const app = Fastify({ logger: true })

app.register(cors, { origin: process.env.CORS_ORIGIN })
app.register(authRoutes)
app.register(menuRoutes)

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

app.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`Servidor rodando na porta ${port}`);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});