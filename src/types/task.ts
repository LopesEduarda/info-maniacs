export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  status: TaskStatus
  created_at?: Date | string
  updated_at?: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface CreateTaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
}

export interface UpdateTaskInput {
  title?: string
  description?: string | null
  status?: TaskStatus
}
