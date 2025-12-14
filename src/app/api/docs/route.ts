import { NextResponse } from 'next/server'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'API REST para gerenciamento de tarefas com autenticação JWT',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 255 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuário criado com sucesso' },
          '400': { description: 'Erro de validação' },
          '409': { description: 'Email já cadastrado' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Fazer login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login realizado com sucesso' },
          '401': { description: 'Credenciais inválidas' },
        },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'Listar tarefas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['all', 'pending', 'in_progress', 'completed'] } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['title', 'status', 'createdAt'] } },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: {
          '200': { description: 'Lista de tarefas' },
          '401': { description: 'Não autenticado' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Criar nova tarefa',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', minLength: 1, maxLength: 255 },
                  description: { type: 'string', maxLength: 5000 },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Tarefa criada com sucesso' },
          '400': { description: 'Erro de validação' },
        },
      },
    },
    '/api/tasks/{id}': {
      put: {
        tags: ['Tasks'],
        summary: 'Atualizar tarefa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'in_progress', 'completed'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Tarefa atualizada' },
          '403': { description: 'Sem permissão' },
          '404': { description: 'Tarefa não encontrada' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Deletar tarefa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': { description: 'Tarefa deletada' },
          '403': { description: 'Sem permissão' },
          '404': { description: 'Tarefa não encontrada' },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(swaggerDefinition)
}
