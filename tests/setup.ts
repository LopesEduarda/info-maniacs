import { closeDb } from '@/lib/db'

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only_123456789012345678901234567890'
}

if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '7d'
}

if (!process.env.DB_HOST) {
  process.env.DB_HOST = 'localhost'
}

if (!process.env.DB_PORT) {
  process.env.DB_PORT = '3306'
}

if (!process.env.DB_USER) {
  process.env.DB_USER = 'root'
}

if (!process.env.DB_PASSWORD) {
  process.env.DB_PASSWORD = 'rootpassword'
}

if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'task_manager_test'
}

if (!process.env.NODE_ENV) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: false,
    configurable: true,
  })
}

afterAll(async () => {
  await closeDb()
})

jest.setTimeout(10000)
