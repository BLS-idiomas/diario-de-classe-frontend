# 📚 Documentação do Projeto

Este diretório contém toda a documentação técnica do projeto **Diário de Classe Frontend**.

## 📋 Índice de Documentações

### 🔧 Ferramentas de Desenvolvimento

| Ferramenta   | Arquivo                        | Descrição                                     |
| ------------ | ------------------------------ | --------------------------------------------- |
| **Jest**     | [`JEST.md`](./JEST.md)         | Framework de testes unitários e de integração |
| **ESLint**   | [`ESLINT.md`](./ESLINT.md)     | Linter para análise estática de código        |
| **Prettier** | [`PRETTIER.md`](./PRETTIER.md) | Formatador de código automático               |
| **Husky**    | [`HUSKY.md`](./HUSKY.md)       | Git hooks para automação de qualidade         |

### 📡 Gerenciamento de Estado

| Ferramenta      | Arquivo                              | Descrição                                   |
| --------------- | ------------------------------------ | ------------------------------------------- |
| **React Query** | [`REACT_QUERY.md`](./REACT_QUERY.md) | Gerenciamento de estado de servidor e cache |

### 🎨 Componentes UI

| Componente       | Arquivo                  | Descrição                              |
| ---------------- | ------------------------ | -------------------------------------- |
| **Toast System** | [`TOAST.md`](./TOAST.md) | Sistema de notificações não intrusivas |

## 🛠️ Stack Tecnológica

### Frontend

- **Next.js 16** - Framework React com SSR/SSG
- **React 19** - Biblioteca para interfaces de usuário
- **Tailwind CSS 4** - Framework CSS utilitário
- **TypeScript** - Superset JavaScript tipado

### Testes

- **Jest** - Framework de testes
- **React Testing Library** - Utilitários para testar React
- **@testing-library/jest-dom** - Matchers customizados

### Qualidade de Código

- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Husky** - Git hooks automáticos
- **lint-staged** - Execução em arquivos modificados

### Gerenciamento de Estado

- **TanStack Query (React Query)** - Cache e sincronização de dados
- **React Hooks** - Estado local dos componentes

## 🚀 Quick Start

### 1. Instalação

```bash
npm install
```

### 2. Desenvolvimento

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
```

### 3. Qualidade de Código

```bash
npm run lint         # Verifica problemas de código
npm run lint:fix     # Corrige problemas automaticamente
npm run format       # Formata todo o código
npm test             # Executa testes
npm run test:coverage # Testes com cobertura
```

## 📁 Estrutura do Projeto

```
src/
├── app/                 # App Router do Next.js
│   ├── globals.css     # Estilos globais
│   ├── layout.js       # Layout raiz
│   └── page.js         # Página inicial
├── components/          # Componentes reutilizáveis
│   ├── Header/         # Componente de cabeçalho
│   ├── Sidebar/        # Barra lateral
│   ├── Footer/         # Rodapé
│   ├── Layout/         # Layout principal
│   ├── HealthCheck/    # Verificação de status da API
│   └── index.js        # Exportações dos componentes
├── hooks/              # Custom hooks
│   ├── useHealth.js    # Hook para verificação de saúde da API
│   └── *.test.js       # Testes dos hooks
├── providers/          # Providers do React
│   └── QueryProvider.js # Provider do React Query
├── services/           # Serviços de API
│   └── api.js          # Cliente HTTP base
├── contexts/           # Contextos do React
├── models/             # Modelos de dados TypeScript
└── utils/              # Utilitários e helpers
```

## 🔄 Fluxo de Desenvolvimento

### 1. Desenvolvimento Local

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente: copie `.env.example` para `.env.local`
4. Inicie o servidor: `npm run dev`

### 2. Controle de Qualidade (Automático)

1. **Pre-commit**: ESLint + Prettier executam automaticamente
2. **Pre-push**: Todos os testes são executados
3. **Commit-msg**: Mensagens são validadas no padrão Conventional Commits

### 3. Padrões de Commit

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

## 🎯 Scripts NPM Disponíveis

### Desenvolvimento

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção

### Qualidade

- `npm run lint` - Verificar problemas de código
- `npm run lint:fix` - Corrigir problemas automaticamente
- `npm run format` - Formatar código com Prettier
- `npm run format:check` - Verificar formatação

### Testes

- `npm test` - Executar todos os testes
- `npm run test:watch` - Testes em modo watch
- `npm run test:coverage` - Testes com relatório de cobertura

## 🌐 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

## 📊 Métricas de Qualidade

### Coverage Mínimo

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Performance

- **Build Time**: < 60s
- **Test Time**: < 30s
- **Dev Server Start**: < 5s

## 🤝 Contribuição

1. Leia a documentação específica da ferramenta antes de modificar
2. Siga os padrões estabelecidos pelo ESLint e Prettier
3. Escreva testes para novas funcionalidades
4. Use mensagens de commit no padrão Conventional Commits
5. Certifique-se que todos os hooks do Husky passam

## 📞 Suporte

Para dúvidas específicas sobre cada ferramenta, consulte a documentação correspondente:

- 🧪 **Testes**: [`JEST.md`](./JEST.md)
- 🔍 **Linting**: [`ESLINT.md`](./ESLINT.md)
- 🎨 **Formatação**: [`PRETTIER.md`](./PRETTIER.md)
- 🎣 **Git Hooks**: [`HUSKY.md`](./HUSKY.md)
- 📡 **API**: [`REACT_QUERY.md`](./REACT_QUERY.md)
- 🎨 **Toast**: [`TOAST.md`](./TOAST.md)

---

> 📝 **Nota**: Esta documentação é mantida atualizada com as configurações do projeto. Sempre consulte a versão mais recente ao fazer alterações.
