// 1. A importação vazia garante que o Fastify original não seja apagado
import 'fastify'

// 2. Tipamos exatamente o que existe dentro do seu token JWT
export interface JwtUserPayload {
  id: string;
  email: string;
  role: string;
}

// 3. Injetamos essa tipagem segura na requisição
declare module 'fastify' {
  export interface FastifyRequest {
    user?: JwtUserPayload; // 👈 Zero 'any'! Tipagem 100% estrita e profissional.
  }
}