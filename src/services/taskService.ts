import { prisma } from '@/lib/prisma'
import type { Task, TaskStatus } from '@/types/task'

export class TaskService {
  async findMany(
    userId: number,
    filters: {
      status?: TaskStatus | 'all'
      search?: string
      sortBy?: 'title' | 'status' | 'createdAt'
      sortOrder?: 'asc' | 'desc'
      page?: number
      limit?: number
    }
  ) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: {
      userId: number
      status?: TaskStatus
      OR?: Array<{ title?: { contains: string }; description?: { contains: string } }>
    } = {
      userId,
    }

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }

    const orderBy: {
      title?: 'asc' | 'desc'
      status?: 'asc' | 'desc'
      createdAt?: 'asc' | 'desc'
    } = {}
    if (filters.sortBy === 'title') {
      orderBy.title = filters.sortOrder || 'asc'
    } else if (filters.sortBy === 'status') {
      orderBy.status = filters.sortOrder || 'asc'
    } else {
      orderBy.createdAt = filters.sortOrder || 'desc'
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.task.count({ where }),
    ])

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id: number, userId: number) {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    })
  }

  async create(data: {
    userId: number
    title: string
    description?: string | null
    status?: TaskStatus
  }) {
    return prisma.task.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description || null,
        status: data.status || 'pending',
      },
    })
  }

  async update(
    id: number,
    userId: number,
    data: {
      title?: string
      description?: string | null
      status?: TaskStatus
    }
  ) {
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    })

    if (!existingTask) {
      return null
    }

    return prisma.task.update({
      where: { id },
      data,
    })
  }

  async delete(id: number, userId: number) {
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    })

    if (!existingTask) {
      return null
    }

    return prisma.task.delete({
      where: { id },
    })
  }
}

export const taskService = new TaskService()
