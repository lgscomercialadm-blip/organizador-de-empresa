# ArcSys Dash - Sistema de Gestão de Clientes e Projetos

Sistema completo de gestão de clientes e projetos da ARXSYS com painel administrativo interno e visão externa para clientes.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **JWT** para autenticação
- **Zod** para validação

### Frontend
- **React** + **TypeScript** + **Vite**
- **TailwindCSS** para estilização
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **@dnd-kit** para drag-and-drop (futuro)

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd organizador-de-empresa
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE arcsys_dash;
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` no diretório `server`:

```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arcsys_dash?schema=public"
JWT_SECRET="arcsys-dash-secret-key-change-in-production-2024"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### 5. Execute as migrações do banco de dados

```bash
cd server
npm run prisma:migrate
```

### 6. Popule o banco de dados com dados iniciais

```bash
cd server
npx tsx prisma/seed.ts
```

Este comando irá criar:
- ✅ Usuário admin: `admin@arcsys.com` / `admin123`
- ✅ Produto: "Assessoria Geral"
- ✅ 7 fases com templates de ações

## 🏃 Executando o projeto

### Desenvolvimento (ambos servidores simultaneamente)

```bash
npm run dev
```

Ou execute separadamente:

**Backend** (porta 3001):
```bash
cd server
npm run dev
```

**Frontend** (porta 5173):
```bash
cd client
npm run dev
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 👤 Acesso ao Sistema

**Credenciais padrão:**
- Email: `admin@arcsys.com`
- Senha: `admin123`

## 📁 Estrutura do Projeto

```
organizador-de-empresa/
├── server/                 # Backend (API)
│   ├── src/
│   │   ├── controllers/   # Controllers da API
│   │   ├── services/      # Lógica de negócio
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares (auth, etc)
│   │   ├── utils/         # Utilitários (JWT, deadline, etc)
│   │   ├── config/        # Configurações (database)
│   │   └── index.ts       # Entrada do servidor
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco de dados
│   │   └── seed.ts        # Script de seed
│   └── package.json
│
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas/Rotas
│   │   ├── services/     # Serviços de API
│   │   ├── contexts/     # React Contexts (Auth)
│   │   ├── hooks/        # Custom Hooks
│   │   ├── utils/        # Utilitários
│   │   ├── types/        # TypeScript types
│   │   ├── App.tsx       # Componente principal
│   │   └── main.tsx      # Entrada do app
│   └── package.json
│
└── package.json           # Root package (workspace)
```

## 🎯 Funcionalidades Principais

### ✅ Painel Admin

1. **Dashboard**
   - Visão geral de clientes
   - Estatísticas de progresso
   - Alertas de atrasos

2. **Gestão de Clientes**
   - Criar novo cliente
   - Listar todos os clientes
   - Ver status e progresso
   - Identificar atrasos

3. **Quadro de Cliente (Tipo Trello)**
   - Visualização em colunas (fases)
   - Cards de ações com status
   - Indicadores de prazo (D+1, D+5, D+7)
   - Alertas visuais de atraso
   - Progresso por fase
   - Visibilidade (interno vs cliente)

4. **Produtos e Templates**
   - Visualizar produtos configurados
   - Templates de fases e ações

### 🔜 Futuras Funcionalidades

- [ ] Drag-and-drop para reordenar fases e ações
- [ ] Edição inline de cards
- [ ] Formulários de criação/edição de fases e ações
- [ ] Histórico de alterações detalhado
- [ ] Notificações de atrasos
- [ ] Visão do cliente (portal externo)
- [ ] Relatórios e exports
- [ ] Gestão de usuários internos
- [ ] Upload de arquivos

## 📊 Modelo de Dados

### Principais Entidades

- **User**: Usuários do sistema (Admin, Internal, Client)
- **Product**: Produtos/serviços oferecidos
- **PhaseTemplate**: Templates de fases para cada produto
- **ActionTemplate**: Templates de ações para cada fase
- **Client**: Clientes da empresa
- **Board**: Quadro de cada cliente
- **Phase**: Fases do quadro (instâncias dos templates)
- **Action**: Ações dentro das fases
- **HistoryEntry**: Histórico de alterações

## 🔐 Autenticação e Autorização

O sistema utiliza JWT para autenticação com três níveis de acesso:

- **ADMIN**: Acesso total ao sistema
- **INTERNAL**: Acesso interno (consultores, equipe)
- **CLIENT**: Acesso limitado ao próprio projeto (futuro)

## 🎨 Sistema de Prazos

O sistema suporta três tipos de prazos:

1. **RELATIVE_DAYS**: Prazos relativos à data de entrada (D+1, D+5, D+7, etc.)
2. **SPECIFIC_DATE**: Data específica
3. **RECURRING**: Recorrente (diário, semanal, mensal)

O cálculo de atrasos é automático com base na data de entrada (D0) do cliente.

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário atual

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Buscar cliente
- `POST /api/clients` - Criar cliente
- `PATCH /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Quadros
- `GET /api/boards/client/:clientId` - Buscar quadro do cliente
- `POST /api/boards/board/:boardId/phases` - Criar fase
- `PATCH /api/boards/phases/:phaseId` - Atualizar fase
- `DELETE /api/boards/phases/:phaseId` - Deletar fase
- `POST /api/boards/phases/:phaseId/actions` - Criar ação
- `PATCH /api/boards/actions/:actionId` - Atualizar ação
- `DELETE /api/boards/actions/:actionId` - Deletar ação
- `GET /api/boards/actions/:actionId/history` - Histórico da ação

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (Admin)
- `PATCH /api/products/:id` - Atualizar produto (Admin)
- `DELETE /api/products/:id` - Deletar produto (Admin)

## 🛠️ Comandos Úteis

### Backend

```bash
# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Gerar Prisma Client
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Abrir Prisma Studio (GUI do banco)
npm run prisma:studio
```

### Frontend

```bash
# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🐛 Troubleshooting

### Erro de conexão com banco de dados

Verifique se:
1. PostgreSQL está rodando
2. Database existe
3. URL de conexão no `.env` está correta

### Erro ao instalar dependências

Limpe o cache do npm:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS

Verifique se a variável `CORS_ORIGIN` no `.env` está correta.

## 📄 Licença

Este projeto é propriedade da ARXSYS.

## 👥 Autores

Desenvolvido para ARXSYS.
