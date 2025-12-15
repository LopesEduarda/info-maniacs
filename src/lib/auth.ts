import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '@/types/api'

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente')
  }
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, email: string): string {
  const payload: JwtPayload = {
    userId,
    email,
  }

  const secret = getJwtSecret()

  return jwt.sign(payload as jwt.JwtPayload, secret, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function generateRefreshToken(userId: number, email: string): string {
  const payload: JwtPayload = {
    userId,
    email,
  }

  const secret = getJwtSecret()

  return jwt.sign(payload as jwt.JwtPayload, secret, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret)
    
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'email' in decoded) {
      return decoded as JwtPayload
    }
    
    return null
  } catch (error) {
    return null
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}
