# Task Manager - Sistema de Gerenciamento de Tarefas

Sistema full-stack completo para gerenciamento de tarefas pessoais, desenvolvido com Next.js 14, TypeScript, MySQL, Prisma ORM e Docker.

## 🚀 Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de estado e cache
- **Context API** - Gerenciamento de estado global (Auth, Theme)

### Backend
- **Next.js API Routes** - API REST
- **Prisma ORM** - ORM para MySQL
- **MySQL 8.0** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados

### DevOps & Ferramentas
- **Docker & Docker Compose** - Containerização
- **Jest** - Testes unitários e integração
- **Supertest** - Testes de API
- **Playwright** - Testes E2E
- **Swagger/OpenAPI** - Documentação interativa da API

## 📋 Pré-requisitos

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)

Não é necessário instalar Node.js, MySQL ou outras dependências localmente. Tudo roda dentro de containers Docker.

## 🏃 Execução Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/LopesEduarda/info-maniacs.git
cd infomaniacs
```

### 2. Configure as variáveis de ambiente (opcional)

O projeto já vem com variáveis padrão configuradas no `docker-compose.yml`. Se quiser personalizar, copie o arquivo `.env.example`:

```bash
cp .env.example .env
```

### 3. Execute com Docker Compose

```bash
docker compose up
```

Este comando irá:
- Baixar as imagens necessárias (MySQL, Node.js)
- Criar e inicializar o banco de dados MySQL
- Executar as migrações do Prisma
- Iniciar o servidor Next.js

### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **API Swagger**: http://localhost:3000/api/swagger
- 

### 5. Primeiro acesso

1. Acesse http://localhost:3000
2. Clique em "Crie uma nova conta"
3. Preencha os dados de registro
4. Você será redirecionado automaticamente para o dashboard

## 📁 Estrutura do Projeto

```
infomaniacs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # Endpoints de autenticação
│   │   │   ├── tasks/          # Endpoints de tarefas
│   │   │   ├── docs/           # Swagger JSON
│   │   │   └── swagger/        # Swagger UI
│   │   ├── login/              # Página de login
│   │   ├── register/           # Página de registro
│   │   └── dashboard/          # Dashboard principal
│   ├── components/             # Componentes React
│   │   ├── layout/             # Componentes de layout
│   │   ├── tasks/              # Componentes de tarefas
│   │   └── ui/                 # Componentes UI reutilizáveis
│   ├── contexts/               # React Contexts
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilitários e configurações
│   ├── schemas/                # Schemas Zod
│   ├── services/               # Camada de serviços (Prisma)
│   └── types/                  # TypeScript types
├── prisma/                      # Prisma schema e migrations
├── database/                    # Scripts SQL
├── tests/                       # Testes
│   ├── api/                    # Testes de API
│   ├── e2e/                    # Testes E2E
│   └── helpers/                # Helpers para testes
├── docker-compose.yml          # Configuração Docker
├── Dockerfile                  # Dockerfile da aplicação
└── package.json                # Dependências do projeto
```

## 🔧 Comandos Docker

### Iniciar os containers
```bash
docker compose up
```

### Iniciar em background
```bash
docker compose up -d
```

### Parar os containers
```bash
docker compose down
```

### Parar e remover volumes (limpar banco de dados)
```bash
docker compose down -v
```

### Reconstruir os containers
```bash
docker compose up --build
```

### Ver logs
```bash
docker compose logs -f app
```

### Ver logs do MySQL
```bash
docker compose logs -f mysql
```

## 🧪 Testes

### Executar testes do backend
```bash
docker compose exec app npm test
```

### Executar testes com coverage
```bash
docker compose exec app npm run test:coverage
```

### Executar testes E2E

**Opção 1: Dentro do Docker (Recomendado)**
```bash
# Certifique-se de que a aplicação está rodando
docker compose up -d

# Execute os testes E2E
docker compose exec app npm run test:e2e
```

**Opção 2: Com interface gráfica (mais fácil para debug)**
```bash
docker compose exec app npm run test:e2e:ui
```

**Opção 3: Localmente (sem Docker)**
```bash
# Certifique-se de que a aplicação está rodando em http://localhost:3000
npm run test:e2e
```

**Nota:** Os testes E2E usam Playwright e requerem que a aplicação esteja rodando. Eles abrem um navegador automatizado e testam os fluxos completos de autenticação e gerenciamento de tarefas.

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

- **Access Token**: Expira em 7 dias (configurável via `JWT_EXPIRES_IN`)
- **Refresh Token**: Expira em 30 dias (configurável via `JWT_REFRESH_EXPIRES_IN`)
- **Senhas**: Hash com bcrypt (12 salt rounds)

### Requisitos de senha
- Mínimo 8 caracteres
- Pelo menos uma letra maiúscula
- Pelo menos uma letra minúscula
- Pelo menos um número

## 📊 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Refresh token automático
- ✅ Logout
- ✅ Rotas protegidas

### Gerenciamento de Tarefas
- ✅ Criar tarefas
- ✅ Listar tarefas (com paginação)
- ✅ Editar tarefas
- ✅ Deletar tarefas
- ✅ Filtrar por status (Pendente, Em Progresso, Concluída)
- ✅ Buscar tarefas (por título ou descrição)
- ✅ Ordenar tarefas (por título, status ou data)
- ✅ Paginação de resultados

### Interface
- ✅ Design moderno com gradientes rosa
- ✅ Dark/Light Mode
- ✅ Responsivo (mobile-first)
- ✅ Feedback visual (loading, erros, sucessos)
- ✅ Validação de formulários em tempo real

### API
- ✅ RESTful API completa
- ✅ Documentação Swagger/OpenAPI
- ✅ Validação de dados com Zod
- ✅ Tratamento de erros padronizado
- ✅ Middleware de autenticação

## 🗄️ Banco de Dados

### Estrutura

**Tabela `users`**
- `id` (INT, PK, AUTO_INCREMENT)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255), UNIQUE)
- `password` (VARCHAR(255), hasheada)
- `created_at` (TIMESTAMP)

**Tabela `tasks`**
- `id` (INT, PK, AUTO_INCREMENT)
- `user_id` (INT, FK -> users.id)
- `title` (VARCHAR(255))
- `description` (TEXT, nullable)
- `status` (ENUM: 'pending', 'in_progress', 'completed')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Migrações

As migrações são executadas automaticamente pelo Prisma quando o container inicia. Para executar manualmente:

```bash
docker compose exec app npx prisma migrate dev
```

### Prisma Studio

Para visualizar e editar dados no banco:

```bash
docker compose exec app npx prisma studio
```

Acesse: http://localhost:5555

## 📚 Documentação da API

A documentação completa da API está disponível em:

- **Swagger UI**: http://localhost:3000/api/swagger
- **JSON OpenAPI**: http://localhost:3000/api/docs

Ou consulte o arquivo `API.md` para documentação detalhada.

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (12 salt rounds)
- ✅ JWT para autenticação
- ✅ Validação de dados no frontend e backend
- ✅ Proteção contra SQL Injection (Prisma ORM)
- ✅ CORS configurado
- ✅ Rotas protegidas com middleware
- ✅ Isolamento de dados por usuário

## 🌐 Variáveis de Ambiente

As variáveis de ambiente estão configuradas no `docker-compose.yml`. Para desenvolvimento local sem Docker, crie um arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL=mysql://taskuser:taskpassword@localhost:3306/task_manager

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Ambiente
NODE_ENV=development
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
- Verifique se o container MySQL está rodando: `docker compose ps`
- Aguarde alguns segundos após iniciar os containers para o MySQL inicializar

### Erro: "Prisma Client not initialized"
- Execute: `docker compose exec app npx prisma generate`

### Erro: "Port 3000 already in use"
- Pare outros serviços na porta 3000 ou altere a porta no `docker-compose.yml`

### Limpar tudo e começar do zero
```bash
docker compose down -v
docker compose up --build
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build de produção
npm run start           # Inicia servidor de produção

# Testes
npm test                # Executa testes
npm run test:watch      # Testes em modo watch
npm run test:coverage   # Testes com coverage
npm run test:e2e        # Testes E2E
npm run test:e2e:ui     # Testes E2E com UI

# Prisma
npm run prisma:generate # Gera Prisma Client
npm run prisma:migrate  # Executa migrações
npm run prisma:studio   # Abre Prisma Studio

# Docker
npm run docker:up       # Inicia containers
npm run docker:down    # Para containers
npm run docker:build   # Reconstrói containers
npm run docker:logs    # Ver logs
```
