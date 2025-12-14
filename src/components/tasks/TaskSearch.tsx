'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'

interface TaskSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TaskSearch({ searchQuery, onSearchChange }: TaskSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Input
        label="Buscar tarefas"
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
    </form>
  )
}

