'use client'

import { Button } from '@/components/ui/Button'

interface TaskSortProps {
  sortBy: 'title' | 'status' | 'createdAt'
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: 'title' | 'status' | 'createdAt', sortOrder: 'asc' | 'desc') => void
}

export function TaskSort({ sortBy, sortOrder, onSortChange }: TaskSortProps) {
  const sortOptions: Array<{ value: 'title' | 'status' | 'createdAt'; label: string }> = [
    { value: 'createdAt', label: 'Data' },
    { value: 'title', label: 'Título' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Ordenar por:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'title' | 'status' | 'createdAt', sortOrder)}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button
        variant="secondary"
        onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
        className="text-sm px-3 py-1"
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </Button>
    </div>
  )
}

