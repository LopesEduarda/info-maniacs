'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { debounce } from 'lodash'

interface TaskSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TaskSearch({ searchQuery, onSearchChange }: TaskSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
      const debouncedSearch = debounce((query: string) => {
      onSearchChange(query)
    }, 500)
    debouncedSearch(localQuery)
  }, [localQuery, onSearchChange])

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

