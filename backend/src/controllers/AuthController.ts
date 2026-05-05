import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';
import { hashPassword, comparePassword, generateToken } from '../services/AuthService';

// 1. Crie a Interface fora da função. Isso demonstra organização.
interface RegisterBody {
  name: string;
  phone: string;
  email: string;
  password: string;
}

// 2. Injete a Interface no Generic do FastifyRequest: <{ Body: SuaInterface }>
export async function register(
  req: FastifyRequest<{ Body: RegisterBody }>, 
  rep: FastifyReply
) {
  
  // 3. O TypeScript agora sabe nativamente o que é o req.body. 
  // Sem erros, sem 'as', sem gambiarras.
  const { name, phone, email, password } = req.body;

  if (!name || !email || !password || !phone) {
    return rep.status(400).send({ error: 'Todos os campos são obrigatórios' });
  }

  if (password.length < 6) {
    return rep.status(400).send({ error: 'A senha deve ter no mínimo 6 caracteres' });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return rep.status(409).send({ error: 'Email já cadastrado' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name,
      phone,
      email,
      password: hashedPassword,
      role: 'cliente',
    },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return rep.status(201).send({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

interface LoginBody {
  email: string
  password: string
}

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  rep: FastifyReply
) {
  const { email, password } = req.body

  if (!email || !password) {
    return rep.status(400).send({ error: 'Email e senha são obrigatórios' })
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return rep.status(401).send({ error: 'Email ou senha incorretos' })
  }

  const passwordMatch = await comparePassword(password, user.password)
  if (!passwordMatch) {
    return rep.status(401).send({ error: 'Email ou senha incorretos' })
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  return rep.send({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  })
}