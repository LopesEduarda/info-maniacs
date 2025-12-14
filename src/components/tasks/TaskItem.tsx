'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { Task } from '@/types/task'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { EditTaskForm } from './EditTaskForm'

interface TaskItemProps {
  task: Task
  onUpdated: () => void
}

const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  completed: 'Concluída',
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-pink-100 text-pink-800',
  completed: 'bg-green-100 text-green-800',
}

export function TaskItem({ task, onUpdated }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      const response = await apiClient.delete(`/tasks/${task.id}`)

      if (response.success) {
        onUpdated()
      } else {
        setError(response.error || 'Erro ao deletar tarefa')
      }
    } catch (error) {
      setError('Erro ao deletar tarefa')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleStatusChange = async (newStatus: Task['status']) => {
    try {
      const response = await apiClient.put<{ task: Task }>(`/tasks/${task.id}`, {
        status: newStatus,
      })

      if (response.success) {
        onUpdated()
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (isEditing) {
    return (
      <EditTaskForm
        task={task}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false)
          onUpdated()
        }}
      />
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-6 border border-pink-100/50">
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}
            >
              {statusLabels[task.status]}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Criada em:{' '}
              {new Date(task.created_at).toLocaleDateString('pt-BR')}
            </span>
            {task.updated_at !== task.created_at && (
              <span>
                Atualizada em:{' '}
                {new Date(task.updated_at).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <select
            value={task.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as Task['status'])
            }
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Progresso</option>
            <option value="completed">Concluída</option>
          </select>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="text-sm px-3 py-1"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              isLoading={isDeleting}
              className="text-sm px-3 py-1"
            >
              Deletar
            </Button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-3">
            Tem certeza que deseja deletar esta tarefa? Esta ação não pode ser
            desfeita.
          </p>
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="text-sm"
            >
              Confirmar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
