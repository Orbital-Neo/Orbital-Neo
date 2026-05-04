import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '8h'

// Gera o hash da senha antes de salvar no banco
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Compara a senha enviada com o hash salvo no banco
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Gera o token JWT com os dados do usuário
export function generateToken(user: {
  id: string
  email: string
  role: string
}): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Valida e decodifica o token JWT
export function verifyToken(token: string): {
  id: string
  email: string
  role: string
} {
  return jwt.verify(token, JWT_SECRET) as {
    id: string
    email: string
    role: string
  }
}