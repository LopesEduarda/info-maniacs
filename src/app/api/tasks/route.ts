import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { taskService } from '@/services/taskService'
import { createTaskSchema } from '@/schemas/task'
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api-response'

export const GET = withAuth(async (request: NextRequest, userId: number) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') as 'all' | 'pending' | 'in_progress' | 'completed' | null
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as 'title' | 'status' | 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const result = await taskService.findMany(userId, {
      status: status || 'all',
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    })

    return successResponse(result, 'Tarefas listadas com sucesso')
  } catch (error) {
    console.error('Erro ao listar tarefas:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro ao listar tarefas')
  }
})

export const POST = withAuth(async (request: NextRequest, userId: number) => {
  try {
    const body = await request.json()

    const validationResult = createTaskSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message)
      return validationErrorResponse(errors)
    }

    const { title, description, status } = validationResult.data

    const newTask = await taskService.create({
      userId,
      title,
      description: description || null,
      status: status || 'pending',
    })

    return successResponse(
      { task: newTask },
      'Tarefa criada com sucesso',
      201
    )
  } catch (error) {
    console.error('Erro ao criar tarefa:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro ao criar tarefa')
  }
})
