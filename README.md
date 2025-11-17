# Organizador Empresarial

Ferramenta completa de gestão empresarial para pequenos empresários organizarem suas empresas, setores, equipes e tarefas.

## Funcionalidades

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Sessões seguras com NextAuth.js

### Dashboard
- ✅ Visualização de tarefas do dia
- ✅ Alertas e lembretes automáticos
- ✅ Estatísticas gerais (tarefas pendentes, alertas, setores)
- ✅ Interface intuitiva e responsiva

### Gestão de Setores
- ✅ Cadastro de setores/departamentos da empresa
- ✅ Organização por cores
- ✅ Descrições detalhadas

### Gestão de Equipe
- ✅ Cadastro de membros da equipe
- ✅ Definição de cargos
- ✅ Informações de contato

### Gestão de Tarefas
- ✅ Criação de tarefas com datas de vencimento
- ✅ Tarefas recorrentes (diárias, semanais, mensais, anuais)
- ✅ Atribuição de responsáveis
- ✅ Vinculação com setores
- ✅ Sistema de alertas configuráveis
- ✅ Marcação de conclusão

### Canais de Venda
- ✅ Cadastro de canais de venda
- ✅ Configuração de dias de fechamento
- ✅ Controle de obrigações por canal

### Sistema de Alertas
- ✅ Lembretes automáticos X dias antes do vencimento
- ✅ Visualização de alertas não lidos
- ✅ Integração com tarefas

## Stack Tecnológica

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite (Prisma ORM)
- **Autenticação**: NextAuth.js
- **UI**: Tailwind CSS + Radix UI
- **Validação**: Zod + React Hook Form

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd organizador-de-empresa
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Já existe um arquivo .env com as configurações padrão
# Para produção, altere o NEXTAUTH_SECRET
```

4. Execute as migrations do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse http://localhost:3000

## Estrutura do Projeto

```
├── app/
│   ├── api/              # Rotas de API
│   │   ├── auth/         # Autenticação
│   │   ├── setores/      # CRUD de setores
│   │   ├── equipe/       # CRUD de equipe
│   │   ├── tarefas/      # CRUD de tarefas
│   │   ├── canais-venda/ # CRUD de canais
│   │   └── register/     # Registro de usuários
│   ├── dashboard/        # Dashboard principal
│   ├── login/            # Página de login
│   └── page.tsx          # Página inicial (redireciona)
├── components/
│   ├── ui/               # Componentes UI reutilizáveis
│   └── forms/            # Formulários específicos
├── lib/
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Funções utilitárias
├── prisma/
│   └── schema.prisma     # Schema do banco de dados
└── types/                # Definições de tipos TypeScript
```

## Modelos de Dados

### User
- Usuário empresário/administrador
- Relações: setores, equipe, tarefas, canais, alertas

### Setor
- Departamentos da empresa (Financeiro, RH, Comercial, etc.)
- Possui cor para identificação visual

### MembroEquipe
- Membros da equipe que podem ser responsáveis por tarefas

### CanalVenda
- Canais de venda com dias de fechamento configuráveis

### Tarefa
- Obrigações e rotinas
- Suporta recorrência
- Possui responsável e setor
- Gera alertas automáticos

### Alerta
- Lembretes automáticos vinculados a tarefas
- Calculados com base em dias de antecedência

## Uso

### Primeiro Acesso
1. Acesse a página inicial e clique em "Criar Conta"
2. Preencha seus dados e crie sua conta
3. Você será redirecionado para o dashboard

### Cadastro de Setores
1. No dashboard, clique na aba "Setores"
2. Clique em "Novo Setor"
3. Preencha nome, descrição e escolha uma cor
4. Salve

### Cadastro de Equipe
1. Vá para a aba "Equipe"
2. Adicione membros da equipe com nome, cargo e email
3. Esses membros poderão ser atribuídos como responsáveis por tarefas

### Criação de Tarefas
1. Na aba "Tarefas", clique em "Nova Tarefa"
2. Defina título, descrição e data de vencimento
3. Escolha se a tarefa é recorrente
4. Atribua um responsável (você ou membro da equipe)
5. Vincule a um setor
6. Configure alertas (ex: lembrar 4 dias antes)
7. Salve

### Visualização do Dia
- O dashboard mostra automaticamente as tarefas do dia atual
- Alertas são exibidos quando tarefas estão próximas do vencimento
- Você pode marcar tarefas como concluídas

## Próximas Funcionalidades

- [ ] Calendário visual interativo
- [ ] Edição e exclusão de itens
- [ ] Filtros e busca avançada
- [ ] Relatórios e estatísticas
- [ ] Notificações por email
- [ ] Exportação de dados
- [ ] Temas personalizáveis
- [ ] App mobile

## Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## Licença

MIT
