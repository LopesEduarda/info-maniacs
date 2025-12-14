import { NextRequest } from 'next/server'
import { registerSchema } from '@/schemas/auth'
import { userService } from '@/services/userService'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import type { UserWithoutPassword } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message)
      return validationErrorResponse(errors)
    }

    const { name, email, password } = validationResult.data

    const existingUser = await userService.findByEmail(email)

    if (existingUser) {
      return errorResponse('Email já cadastrado', 'Este email já está em uso', 409)
    }

    const newUser = await userService.create({ name, email, password })

    const userWithoutPassword: UserWithoutPassword = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      created_at: newUser.createdAt,
    }

    return successResponse(
      {
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword,
      },
      'Registro realizado com sucesso',
      201
    )
  } catch (error) {
    console.error('Erro no registro:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro interno do servidor')
  }
}
