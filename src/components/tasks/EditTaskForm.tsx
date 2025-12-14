'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateTaskSchema } from '@/schemas/task'
import { apiClient } from '@/lib/api-client'
import type { Task } from '@/types/task'
import type { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

interface EditTaskFormProps {
  task: Task
  onCancel: () => void
  onSuccess: () => void
}

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>

export function EditTaskForm({ task, onCancel, onSuccess }: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      status: task.status,
    },
  })

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description || '',
      status: task.status,
    })
  }, [task, reset])

  const onSubmit = async (data: UpdateTaskFormData) => {
    try {
      const updateData: {
        title?: string
        description?: string | null
        status?: Task['status']
      } = {}

      if (data.title !== undefined) {
        updateData.title = data.title
      }

      if (data.description !== undefined) {
        updateData.description = data.description || null
      }

      if (data.status !== undefined) {
        updateData.status = data.status
      }

      const response = await apiClient.put<{ task: Task }>(`/tasks/${task.id}`, updateData)

      if (response.success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-6 border border-pink-100/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Tarefa</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Título"
          type="text"
          placeholder="Digite o título da tarefa"
          {...register('title')}
          error={errors.title?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Digite a descrição da tarefa (opcional)"
            {...register('description')}
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            {...register('status')}
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluída</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold"
          >
            Salvar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
