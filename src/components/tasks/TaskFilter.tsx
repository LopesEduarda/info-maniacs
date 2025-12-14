'use client'

import type { TaskStatus } from '@/types/task'

interface TaskFilterProps {
  filterStatus: 'all' | TaskStatus
  onFilterChange: (status: 'all' | TaskStatus) => void
}

export function TaskFilter({ filterStatus, onFilterChange }: TaskFilterProps) {
  const filters: Array<{ value: 'all' | TaskStatus; label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'in_progress', label: 'Em Progresso' },
    { value: 'completed', label: 'Concluídas' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === filter.value
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              : 'bg-white/60 text-gray-700 hover:bg-white/80 border border-pink-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

