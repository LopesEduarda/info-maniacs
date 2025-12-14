# API Documentation - Task Manager

Documentação completa da API REST do Task Manager.

## 📋 Índice

- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Endpoints de Autenticação](#endpoints-de-autenticação)
- [Endpoints de Tarefas](#endpoints-de-tarefas)
- [Códigos de Status](#códigos-de-status)
- [Tratamento de Erros](#tratamento-de-erros)
- [Swagger UI](#swagger-ui)

## 🌐 Base URL

```
http://localhost:3000/api
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. A maioria dos endpoints requer um token de acesso válido.

### Como obter o token

1. Registre um novo usuário em `POST /api/auth/register`
2. Faça login em `POST /api/auth/login`
3. Use o token retornado no header `Authorization: Bearer <token>`

### Headers necessários

```http
Authorization: Bearer <seu_token_jwt>
Content-Type: application/json
```

### Refresh Token

O sistema suporta refresh tokens para renovar o access token sem precisar fazer login novamente:

- **Access Token**: Expira em 7 dias
- **Refresh Token**: Expira em 30 dias

Use o endpoint `POST /api/auth/refresh` para renovar o token.

---

## 🔑 Endpoints de Autenticação

### POST /api/auth/register

Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaSegura123",
  "confirmPassword": "SenhaSegura123"
}
```

**Validações:**
- `name`: Mínimo 2 caracteres, máximo 255
- `email`: Email válido e único
- `password`: Mínimo 8 caracteres, deve conter:
  - Pelo menos uma letra maiúscula
  - Pelo menos uma letra minúscula
  - Pelo menos um número
- `confirmPassword`: Deve ser igual a `password`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "message": "Usuário criado com sucesso",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Registro realizado com sucesso"
}
```

**Erros:**
- `400`: Dados inválidos ou senha fraca
- `409`: Email já cadastrado
- `500`: Erro interno do servidor

---

### POST /api/auth/login

Autentica um usuário e retorna tokens JWT.

**Request Body:**
```json
{
  "email": "joao@example.com",
  "password": "SenhaSegura123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Login realizado com sucesso"
}
```

**Erros:**
- `400`: Dados inválidos
- `401`: Credenciais inválidas
- `500`: Erro interno do servidor

---

### POST /api/auth/refresh

Renova o access token usando o refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Token atualizado com sucesso"
}
```

**Erros:**
- `401`: Refresh token inválido ou expirado
- `500`: Erro interno do servidor

---

## 📝 Endpoints de Tarefas

Todos os endpoints de tarefas requerem autenticação via JWT.

### GET /api/tasks

Lista todas as tarefas do usuário autenticado com filtros, busca, ordenação e paginação.

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `status` (opcional): Filtrar por status (`pending`, `in_progress`, `completed`, ou `all`)
- `search` (opcional): Buscar por título ou descrição
- `sortBy` (opcional): Campo para ordenar (`title`, `status`, `createdAt` - padrão: `createdAt`)
- `sortOrder` (opcional): Ordem (`asc` ou `desc` - padrão: `desc`)

**Exemplo de Request:**
```http
GET /api/tasks?page=1&limit=10&status=pending&search=reunião&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "userId": 1,
        "title": "Reunião com equipe",
        "description": "Discutir próximos passos do projeto",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "Tarefas listadas com sucesso"
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `500`: Erro interno do servidor

---

### POST /api/tasks

Cria uma nova tarefa.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Nova tarefa",
  "description": "Descrição da tarefa (opcional)",
  "status": "pending"
}
```

**Validações:**
- `title`: Obrigatório, mínimo 1 caractere, máximo 255
- `description`: Opcional, máximo 5000 caracteres
- `status`: Opcional, deve ser `pending`, `in_progress` ou `completed` (padrão: `pending`)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "userId": 1,
      "title": "Nova tarefa",
      "description": "Descrição da tarefa",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Tarefa criada com sucesso"
}
```

**Erros:**
- `400`: Dados inválidos
- `401`: Token não fornecido ou inválido
- `500`: Erro interno do servidor

---

### PUT /api/tasks/:id

Atualiza uma tarefa existente. Apenas o dono da tarefa pode atualizá-la.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: ID da tarefa (número)

**Request Body:**
```json
{
  "title": "Tarefa atualizada",
  "description": "Nova descrição",
  "status": "in_progress"
}
```

**Validações:**
- Todos os campos são opcionais
- `title`: Se fornecido, mínimo 1 caractere, máximo 255
- `description`: Se fornecido, máximo 5000 caracteres
- `status`: Se fornecido, deve ser `pending`, `in_progress` ou `completed`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "userId": 1,
      "title": "Tarefa atualizada",
      "description": "Nova descrição",
      "status": "in_progress",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  },
  "message": "Tarefa atualizada com sucesso"
}
```

**Erros:**
- `400`: Dados inválidos ou ID inválido
- `401`: Token não fornecido ou inválido
- `403`: Você não tem permissão para editar esta tarefa
- `404`: Tarefa não encontrada
- `500`: Erro interno do servidor

---

### DELETE /api/tasks/:id

Deleta uma tarefa. Apenas o dono da tarefa pode deletá-la.

**Headers:**
```http
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: ID da tarefa (número)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Tarefa deletada com sucesso"
  },
  "message": "Tarefa deletada com sucesso"
}
```

**Erros:**
- `400`: ID inválido
- `401`: Token não fornecido ou inválido
- `403`: Você não tem permissão para deletar esta tarefa
- `404`: Tarefa não encontrada
- `500`: Erro interno do servidor

---

## 📊 Códigos de Status

| Código | Significado | Quando usar |
|--------|------------|-------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos ou validação falhou |
| 401 | Unauthorized | Token não fornecido ou inválido |
| 403 | Forbidden | Sem permissão para acessar o recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email já cadastrado) |
| 500 | Internal Server Error | Erro interno do servidor |

---

## ⚠️ Tratamento de Erros

Todas as respostas de erro seguem o mesmo formato:

```json
{
  "success": false,
  "error": "Tipo do erro",
  "message": "Mensagem descritiva do erro"
}
```

### Exemplos de Erros

**Erro de Validação (400):**
```json
{
  "success": false,
  "error": "Erro de validação",
  "message": "Título é obrigatório, Email inválido"
}
```

**Não Autorizado (401):**
```json
{
  "success": false,
  "error": "Não autorizado",
  "message": "Token de autenticação não fornecido"
}
```

**Acesso Negado (403):**
```json
{
  "success": false,
  "error": "Acesso negado",
  "message": "Você não tem permissão para realizar esta ação"
}
```

**Não Encontrado (404):**
```json
{
  "success": false,
  "error": "Não encontrado",
  "message": "Tarefa não encontrada ou você não tem permissão para editá-la"
}
```

**Erro Interno (500):**
```json
{
  "success": false,
  "error": "Erro interno",
  "message": "Erro interno do servidor"
}
```

---

## 📖 Swagger UI

A documentação interativa da API está disponível em:

**URL:** http://localhost:3000/api/swagger

No Swagger UI você pode:
- Ver todos os endpoints disponíveis
- Testar os endpoints diretamente no navegador
- Ver exemplos de request/response
- Ver os schemas de validação

### JSON OpenAPI

O arquivo JSON do OpenAPI está disponível em:

**URL:** http://localhost:3000/api/docs

---

## 🔒 Segurança

### Autenticação JWT

- Tokens são assinados com `JWT_SECRET`
- Access tokens expiram em 7 dias
- Refresh tokens expiram em 30 dias
- Tokens devem ser enviados no header `Authorization: Bearer <token>`

### Isolamento de Dados

- Cada usuário só pode acessar suas próprias tarefas
- Tentativas de acessar tarefas de outros usuários retornam 403 ou 404
- Validação de propriedade em todos os endpoints de tarefas

### Validação de Dados

- Todos os dados são validados com Zod no backend
- Validação também ocorre no frontend para melhor UX
- Senhas são hasheadas com bcrypt (12 salt rounds)

---

## 📝 Exemplos de Uso

### Exemplo completo: Criar e listar tarefas

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "SenhaSegura123",
    "confirmPassword": "SenhaSegura123"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SenhaSegura123"
  }'

# 3. Criar tarefa (use o token retornado no login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "title": "Minha primeira tarefa",
    "description": "Esta é uma tarefa de exemplo",
    "status": "pending"
  }'

# 4. Listar tarefas
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer <seu_token>"

# 5. Atualizar tarefa
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{
    "status": "in_progress"
  }'

# 6. Deletar tarefa
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer <seu_token>"
```

---

## 🧪 Testando a API

### Com cURL

Use os exemplos acima ou consulte a documentação Swagger.

### Com Postman/Insomnia

1. Importe a especificação OpenAPI de http://localhost:3000/api/docs
2. Configure a autenticação Bearer Token
3. Teste os endpoints

### Com Swagger UI

1. Acesse http://localhost:3000/api/swagger
2. Clique em "Authorize" e insira seu token JWT
3. Teste os endpoints diretamente na interface

---