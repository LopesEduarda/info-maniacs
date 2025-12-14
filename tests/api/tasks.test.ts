import { NextRequest } from 'next/server'
import { GET as getTasksHandler, POST as createTaskHandler } from '@/app/api/tasks/route'
import { PUT as updateTaskHandler, DELETE as deleteTaskHandler } from '@/app/api/tasks/[id]/route'
import { clearDatabase, createTestUser, createTestTask, getAuthToken } from '../helpers/db'

describe('API Tasks', () => {
  let user1: { id: number; email: string }
  let user2: { id: number; email: string }
  let token1: string
  let token2: string

  beforeEach(async () => {
    await clearDatabase()
    await new Promise(resolve => setTimeout(resolve, 100))
    user1 = await createTestUser({ email: 'user1@example.com' })
    user2 = await createTestUser({ email: 'user2@example.com' })
    token1 = await getAuthToken(user1.id, user1.email)
    token2 = await getAuthToken(user2.id, user2.email)
  })

  describe('GET /api/tasks', () => {
    it('deve retornar 401 sem token de autenticação', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'GET',
      })

      const response = await getTasksHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })

    it('deve retornar lista vazia quando usuário não tem tarefas', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      })

      const response = await getTasksHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.tasks).toHaveLength(0)
    })
  })

  describe('POST /api/tasks', () => {
    it('deve retornar erro ao criar tarefa sem título', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          description: 'Sem título',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
      })

      const response = await createTaskHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('PUT /api/tasks/[id]', () => {
    it('deve atualizar tarefa própria', async () => {
      const task = await createTestTask(user1.id, { title: 'Tarefa Original' })

      const request = new NextRequest(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Tarefa Atualizada',
            status: 'in_progress',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token1}`,
          },
        }
      )

      const response = await updateTaskHandler(request, {
        params: Promise.resolve({ id: task.id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.task.title).toBe('Tarefa Atualizada')
      expect(data.data.task.status).toBe('in_progress')
    })

    it('deve retornar 403 ao tentar atualizar tarefa de outro usuário', async () => {
      const task = await createTestTask(user2.id, { title: 'Tarefa do User2' })

      const request = new NextRequest(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Tentativa de Edição',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token1}`,
          },
        }
      )

      const response = await updateTaskHandler(request, {
        params: Promise.resolve({ id: task.id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Acesso negado')
    })

    it('deve retornar 404 ao tentar atualizar tarefa inexistente', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks/99999', {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Tarefa Inexistente',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token1}`,
        },
      })

      const response = await updateTaskHandler(request, {
        params: Promise.resolve({ id: '99999' }),
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
    })
  })

  describe('DELETE /api/tasks/[id]', () => {
    it('deve deletar tarefa própria', async () => {
      const task = await createTestTask(user1.id, { title: 'Tarefa para Deletar' })

      const request = new NextRequest(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        }
      )

      const response = await deleteTaskHandler(request, {
        params: Promise.resolve({ id: task.id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      const { prisma } = await import('@/lib/prisma')
      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      })
      expect(deletedTask).toBeNull()
    })

    it('deve retornar 403 ao tentar deletar tarefa de outro usuário', async () => {
      const task = await createTestTask(user2.id, { title: 'Tarefa do User2' })

      const request = new NextRequest(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token1}`,
          },
        }
      )

      const response = await deleteTaskHandler(request, {
        params: Promise.resolve({ id: task.id.toString() }),
      })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
    })
  })

  describe('Isolamento de Dados', () => {
    it('usuário 1 não deve ver tarefas do usuário 2', async () => {
      await createTestTask(user1.id, { title: 'Tarefa User1' })
      await createTestTask(user2.id, { title: 'Tarefa User2' })
      await createTestTask(user2.id, { title: 'Tarefa User2 - 2' })

      const request1 = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      })

      const response1 = await getTasksHandler(request1)
      const data1 = await response1.json()

      expect(data1.data.tasks).toHaveLength(1)
      expect(data1.data.tasks[0].title).toBe('Tarefa User1')
      expect(data1.data.tasks[0].user_id).toBe(user1.id)

      const request2 = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      })

      const response2 = await getTasksHandler(request2)
      const data2 = await response2.json()

      expect(data2.data.tasks).toHaveLength(2)
      expect(data2.data.tasks.every((t: { user_id: number }) => t.user_id === user2.id)).toBe(true)
    })
  })
})
