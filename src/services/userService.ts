import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/auth'

export class UserService {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
  }

  async create(data: { name: string; email: string; password: string }) {
    const hashedPassword = await hashPassword(data.password)

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    if (!user || !user.password) {
      return false
    }
    return comparePassword(password, user.password)
  }
}

export const userService = new UserService()

