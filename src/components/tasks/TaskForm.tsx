'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema } from '@/schemas/task'
import { apiClient } from '@/lib/api-client'
import type { Task } from '@/types/task'
import type { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

interface TaskFormProps {
  onSuccess: () => void
}

type TaskFormData = z.infer<typeof createTaskSchema>

export function TaskForm({ onSuccess }: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (data: TaskFormData) => {
    setError('')
    setIsLoading(true)

    try {
      if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        setError('Título é obrigatório')
        setIsLoading(false)
        return
      }

      const payload = {
        title: data.title.trim(),
        description: data.description && typeof data.description === 'string' && data.description.trim() ? data.description.trim() : null,
        status: data.status || 'pending',
      }

      const response = await apiClient.post<{ task: Task }>('/tasks', payload)

      if (response.success) {
        reset({
          title: '',
          description: '',
          status: 'pending',
        })
        onSuccess()
      } else {
        setError(response.error || 'Erro ao criar tarefa')
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      setError('Erro ao criar tarefa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-6 border border-pink-100/50">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Nova Tarefa</h2>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Título"
            type="text"
            placeholder="Digite o título da tarefa"
            {...register('title', {
              required: 'Título é obrigatório',
              minLength: {
                value: 1,
                message: 'Título é obrigatório',
              },
            })}
            error={errors.title?.message}
          />
        </div>

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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold"
        >
          Criar Tarefa
        </Button>
      </form>
    </div>
  )
}
