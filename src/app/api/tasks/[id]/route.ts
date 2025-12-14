import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/lib/middleware'
import { taskService } from '@/services/taskService'
import { updateTaskSchema } from '@/schemas/task'
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  forbiddenResponse,
  serverErrorResponse,
} from '@/lib/api-response'
import type { TaskStatus } from '@/types/task'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if ('error' in authResult) {
      return authResult.error
    }
    const userId = authResult.user.userId

    const resolvedParams = params instanceof Promise ? await params : params
    const taskId = parseInt(resolvedParams.id)

    if (isNaN(taskId)) {
      return validationErrorResponse(['ID da tarefa inválido'])
    }

    const existingTask = await taskService.findById(taskId, userId)

    if (!existingTask) {
      return notFoundResponse('Tarefa não encontrada')
    }

    const body = await request.json()

    const validationResult = updateTaskSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => err.message)
      return validationErrorResponse(errors)
    }

    const updateData: {
      title?: string
      description?: string | null
      status?: TaskStatus
    } = {}

    if (validationResult.data.title !== undefined) {
      updateData.title = validationResult.data.title
    }

    if (validationResult.data.description !== undefined) {
      updateData.description = validationResult.data.description || null
    }

    if (validationResult.data.status !== undefined) {
      updateData.status = validationResult.data.status
    }

    const updatedTask = await taskService.update(taskId, userId, updateData)

    if (!updatedTask) {
      return notFoundResponse('Tarefa não encontrada')
    }

    return successResponse({ task: updatedTask }, 'Tarefa atualizada com sucesso')
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro ao atualizar tarefa')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request)
    if ('error' in authResult) {
      return authResult.error
    }
    const userId = authResult.user.userId

    const resolvedParams = params instanceof Promise ? await params : params
    const taskId = parseInt(resolvedParams.id)

    if (isNaN(taskId)) {
      return validationErrorResponse(['ID da tarefa inválido'])
    }

    const deletedTask = await taskService.delete(taskId, userId)

    if (!deletedTask) {
      return notFoundResponse('Tarefa não encontrada')
    }

    return successResponse(
      { message: 'Tarefa deletada com sucesso' },
      'Tarefa deletada com sucesso'
    )
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error)

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return serverErrorResponse('Erro ao conectar com o banco de dados')
    }

    return serverErrorResponse('Erro ao deletar tarefa')
  }
}
