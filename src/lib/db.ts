import { prisma } from './prisma'
import type { Task, TaskStatus } from '@/types/task'
import type { User } from '@/types/user'

export const getDb = () => prisma

export const query = async <T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T> => {
  throw new Error('query() is deprecated. Use Prisma client directly.')
}

export const queryOne = async <T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T | null> => {
  throw new Error('queryOne() is deprecated. Use Prisma client directly.')
}

export const insert = async (
  sql: string,
  params?: unknown[]
): Promise<number> => {
  throw new Error('insert() is deprecated. Use Prisma client directly.')
}

export const closeDb = async () => {
  await prisma.$disconnect()
}
