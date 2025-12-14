'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Task } from '@/types/task'
import { TaskItem } from './TaskItem'
import { Loading } from '@/components/ui/Loading'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

interface TaskListProps {
  filterStatus?: 'all' | 'pending' | 'in_progress' | 'completed'
  searchQuery?: string
  sortBy?: 'title' | 'status' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  onTaskUpdated: () => void
  refreshKey?: number
}

interface TasksResponse {
  tasks: Task[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function TaskList({
  filterStatus = 'all',
  searchQuery = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onTaskUpdated,
  refreshKey,
}: TaskListProps) {
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, error, refetch } = useQuery<TasksResponse>({
    queryKey: ['tasks', filterStatus, searchQuery, sortBy, sortOrder, page, refreshKey],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery }),
        sortBy,
        sortOrder,
      })

      const response = await apiClient.get<TasksResponse>(`/tasks?${params.toString()}`)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.error || 'Erro ao buscar tarefas')
    },
  })

  useEffect(() => {
    refetch()
  }, [refreshKey, refetch])

  const handleTaskUpdated = () => {
    refetch()
    onTaskUpdated()
  }

  const tasks = data?.tasks || []
  const pagination = data?.pagination

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Carregando tarefas..." />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={error instanceof Error ? error.message : 'Erro ao carregar tarefas'}
        onClose={() => {}}
      />
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {filterStatus === 'all'
            ? 'Você ainda não possui tarefas. Crie sua primeira tarefa!'
            : `Nenhuma tarefa com status "${filterStatus}" encontrada.`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdated={handleTaskUpdated}
        />
      ))}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
