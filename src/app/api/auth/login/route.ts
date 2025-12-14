import { NextRequest } from 'next/server'
import { loginSchema } from '@/schemas/auth'
import { generateToken, generateRefreshToken } from '@/lib/auth'
import { userService } from '@/services/userService'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import type { UserWithoutPassword, AuthResponse } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message)
      return validationErrorResponse(errors)
    }

    const { email, password } = validationResult.data

    const user = await userService.findByEmail(email)

    if (!user) {
      return errorResponse(
        'Credenciais inválidas',
        'Email ou senha incorretos',
        401
      )
    }

    const isPasswordValid = await userService.verifyPassword(email, password)

    if (!isPasswordValid) {
      return errorResponse(
        'Credenciais inválidas',
        'Email ou senha incorretos',
        401
      )
    }

    const token = generateToken(user.id, user.email)
    const refreshToken = generateRefreshToken(user.id, user.email)

    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    }

    const authResponse: AuthResponse = {
      token,
      refreshToken,
      user: userWithoutPassword,
    }

    return successResponse(authResponse, 'Login realizado com sucesso')
  } catch (error) {
    console.error('Erro no login:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro interno do servidor')
  }
}
