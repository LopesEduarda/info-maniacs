import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types/api'

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  )
}

export function errorResponse(
  error: string,
  message?: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(message && { message }),
    },
    { status }
  )
}

export function validationErrorResponse(
  errors: string[] | string
): NextResponse<ApiResponse> {
  const errorMessage = Array.isArray(errors) ? errors.join(', ') : errors
  return errorResponse('Erro de validação', errorMessage, 400)
}

export function unauthorizedResponse(
  message: string = 'Não autorizado'
): NextResponse<ApiResponse> {
  return errorResponse('Não autorizado', message, 401)
}

export function forbiddenResponse(
  message: string = 'Você não tem permissão para realizar esta ação'
): NextResponse<ApiResponse> {
  return errorResponse('Acesso negado', message, 403)
}

export function notFoundResponse(
  message: string = 'Recurso não encontrado'
): NextResponse<ApiResponse> {
  return errorResponse('Não encontrado', message, 404)
}

export function serverErrorResponse(
  message: string = 'Erro interno do servidor'
): NextResponse<ApiResponse> {
  return errorResponse('Erro interno', message, 500)
}
