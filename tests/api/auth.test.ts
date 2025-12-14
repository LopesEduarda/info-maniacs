import { NextRequest } from 'next/server'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { clearDatabase, createTestUser } from '../helpers/db'
import { comparePassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

describe('API Auth - Register', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  it('deve registrar um novo usuário com dados válidos', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test1234',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await registerHandler(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data.user).toHaveProperty('id')
    expect(data.data.user).toHaveProperty('name', 'Test User')
    expect(data.data.user).toHaveProperty('email', 'test@example.com')
    expect(data.data.user).not.toHaveProperty('password')
  })

  it('deve retornar erro ao tentar registrar com email duplicado', async () => {
    await createTestUser({ email: 'duplicate@example.com' })

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Another User',
        email: 'duplicate@example.com',
        password: 'Test1234',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await registerHandler(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Email já cadastrado')
  })

  it('deve retornar erro ao registrar com senha fraca', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await registerHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })

  it('deve retornar erro ao registrar com email inválido', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Test1234',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await registerHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})

describe('API Auth - Login', () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  it('deve fazer login com credenciais válidas', async () => {
    const password = 'Test1234'
    const user = await createTestUser({
      email: 'login@example.com',
      password,
    })

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'login@example.com',
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('token')
    expect(data.data).toHaveProperty('refreshToken')
    expect(data.data).toHaveProperty('user')
    expect(data.data.user.id).toBe(user.id)
    expect(data.data.user.email).toBe('login@example.com')
    expect(data.data.user).not.toHaveProperty('password')
  })

  it('deve retornar erro ao fazer login com credenciais inválidas', async () => {
    await createTestUser({
      email: 'user@example.com',
      password: 'Correct123',
    })

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'WrongPassword',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Credenciais inválidas')
  })

  it('deve retornar erro ao fazer login com email inexistente', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'Test1234',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Credenciais inválidas')
  })
})

describe('API Auth - Password Hashing', () => {
  it('deve hashar senha corretamente no registro', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Hash Test',
        email: 'hash@example.com',
        password: 'Test1234',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await registerHandler(request)

    const user = await prisma.user.findUnique({
      where: { email: 'hash@example.com' },
      select: { password: true },
    })

    expect(user).toBeTruthy()
    expect(user?.password).not.toBe('Test1234')
    expect(user?.password?.length).toBeGreaterThan(20)

    if (user?.password) {
      const isValid = await comparePassword('Test1234', user.password)
      expect(isValid).toBe(true)
    }
  })
})
