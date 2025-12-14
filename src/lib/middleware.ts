import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from './auth'
import { unauthorizedResponse } from './api-response'
import type { JwtPayload } from '@/types/api'

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: JwtPayload } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return {
      error: unauthorizedResponse('Token de autenticação não fornecido'),
    }
  }

  const payload = verifyToken(token)

  if (!payload || !payload.userId) {
    return {
      error: unauthorizedResponse('Token inválido ou expirado'),
    }
  }

  return { user: payload }
}

export function withAuth(
  handler: (
    request: NextRequest,
    userId: number,
    context?: { params: Promise<{ id: string }> | { id: string } }
  ) => Promise<NextResponse>
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<{ id: string }> | { id: string } }
  ) => {
    const authResult = await authenticateRequest(request)

    if ('error' in authResult) {
      return authResult.error
    }

    const { user } = authResult
    return handler(request, user.userId, context)
  }
}
