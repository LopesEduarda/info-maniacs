import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import type { User } from '@/types/user'
import type { Task } from '@/types/task'

export async function clearDatabase() {
  try {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`
    
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
    
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`
    
    try {
      await prisma.$executeRaw`ALTER TABLE tasks AUTO_INCREMENT = 1`
      await prisma.$executeRaw`ALTER TABLE users AUTO_INCREMENT = 1`
    } catch (e) {
    }
  } catch (error) {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`
    await prisma.$executeRaw`TRUNCATE TABLE tasks`
    await prisma.$executeRaw`TRUNCATE TABLE users`
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`
  }
}

export async function createTestUser(
  overrides?: Partial<{ name: string; email: string; password: string }>
): Promise<User> {
  const name = overrides?.name || 'Test User'
  const email = overrides?.email || `test${Date.now()}@example.com`
  const password = overrides?.password || 'Test1234'

  const hashedPassword = await hashPassword(password)
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    created_at: user.createdAt,
  }
}

export async function createTestTask(
  userId: number,
  overrides?: Partial<{ title: string; description: string; status: string }>
): Promise<Task> {
  const title = overrides?.title || 'Test Task'
  const description = overrides?.description || 'Test Description'
  const status = (overrides?.status || 'pending') as 'pending' | 'in_progress' | 'completed'

  const task = await prisma.task.create({
    data: {
      userId,
      title,
      description,
      status,
    },
  })

  return {
    id: task.id,
    user_id: task.userId,
    title: task.title,
    description: task.description,
    status: task.status,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
  }
}

export async function getAuthToken(userId: number, email: string): Promise<string> {
  const { generateToken } = await import('@/lib/auth')
  return generateToken(userId, email)
}
