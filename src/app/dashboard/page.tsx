'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskFilter } from '@/components/tasks/TaskFilter'
import { TaskSearch } from '@/components/tasks/TaskSearch'
import { TaskSort } from '@/components/tasks/TaskSort'
import type { TaskStatus } from '@/types/task'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | TaskStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTaskUpdated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Minhas Tarefas
              </h1>
              <p className="text-gray-600">
                Gerencie suas tarefas e mantenha-se organizado
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <TaskForm onSuccess={handleTaskUpdated} />
              </div>

              <div className="lg:col-span-2">
                <div className="mb-6 space-y-4">
                  <TaskSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                  <div className="flex flex-wrap gap-4">
                    <TaskFilter
                      filterStatus={filterStatus}
                      onFilterChange={setFilterStatus}
                    />
                    <TaskSort
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortChange={(by, order) => {
                        setSortBy(by)
                        setSortOrder(order)
                      }}
                    />
                  </div>
                </div>
                <TaskList
                  filterStatus={filterStatus}
                  searchQuery={searchQuery}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onTaskUpdated={handleTaskUpdated}
                  refreshKey={refreshKey}
                />
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    </QueryClientProvider>
  )
}
