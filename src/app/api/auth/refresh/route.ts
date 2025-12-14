import { NextRequest } from 'next/server'
import { verifyToken, generateToken } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import type { AuthResponse } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.refreshToken) {
      return validationErrorResponse(['Refresh token é obrigatório'])
    }

    const payload = verifyToken(body.refreshToken)

    if (!payload || !payload.userId) {
      return errorResponse('Refresh token inválido ou expirado', 'Token inválido', 401)
    }

    const newToken = generateToken(payload.userId, payload.email)

    const authResponse: AuthResponse = {
      token: newToken,
      refreshToken: body.refreshToken,
      user: null,
    }

    return successResponse(authResponse, 'Token renovado com sucesso')
  } catch (error) {
    console.error('Erro ao renovar token:', error)
    return serverErrorResponse('Erro interno do servidor')
  }
}

