# Sistema de Toast

O sistema de Toast fornece notificações não intrusivas para feedback do usuário, com suporte a diferentes tipos de mensagens e remoção automática.

## 📦 Dependências

- `lucide-react` - Ícones para os diferentes tipos de toast
- `React Context API` - Gerenciamento de estado global dos toasts

## ⚙️ Estrutura do Sistema

### 🧩 Componentes

#### 1. **Toast Component** (`src/components/Toast/index.js`)

Componente individual que renderiza um toast.

#### 2. **ToastProvider** (`src/providers/ToastProvider.js`)

Provider que gerencia o estado global dos toasts e fornece métodos para criação e remoção.

#### 3. **useToast Hook**

Hook customizado para acessar as funcionalidades do toast.

## 🎯 Tipos de Toast

### ✅ Success (Sucesso)

- **Cor**: Verde
- **Ícone**: Check mark
- **Uso**: Confirmação de ações bem-sucedidas

### ❌ Error (Erro)

- **Cor**: Vermelho
- **Ícone**: X mark
- **Uso**: Erros e falhas de operação

### ⚠️ Warning (Aviso)

- **Cor**: Amarelo
- **Ícone**: Exclamation mark
- **Uso**: Avisos e alertas importantes

### ℹ️ Info (Informação)

- **Cor**: Azul
- **Ícone**: Fire icon (padrão)
- **Uso**: Informações gerais

## 🚀 Configuração

### 1. Provider Setup

O `ToastProvider` já está configurado no layout principal:

```jsx
// src/app/layout.jsx
import { ToastProvider } from '@/providers/ToastProvider';

export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <Layout>{children}</Layout>
      </ToastProvider>
    </QueryProvider>
  );
}
```

### 2. Posicionamento

Os toasts aparecem no **canto superior direito** da tela:

- `position: fixed`
- `top: 1rem` (16px)
- `right: 1rem` (16px)
- `z-index: 50`

## 💻 Como Usar

### Hook useToast

```jsx
import { useToast } from '@/providers/ToastProvider';

function MyComponent() {
  const { success, error, warning, info, addToast, removeToast } = useToast();

  // Métodos de conveniência
  const handleSuccess = () => {
    success('Operação realizada com sucesso!');
  };

  const handleError = () => {
    error('Erro ao processar solicitação!');
  };

  const handleWarning = () => {
    warning('Atenção: Verifique os dados!');
  };

  const handleInfo = () => {
    info('Informação importante!');
  };

  // Método genérico com mais controle
  const handleCustom = () => {
    const toastId = addToast(
      'Mensagem customizada',
      'success',
      10000 // 10 segundos
    );
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
}
```

### Métodos Disponíveis

```jsx
const {
  // Métodos de conveniência
  success, // (message, duration?) => toastId
  error, // (message, duration?) => toastId
  warning, // (message, duration?) => toastId
  info, // (message, duration?) => toastId

  // Métodos genéricos
  addToast, // (message, type, duration) => toastId
  removeToast, // (toastId) => void
  removeAllToasts, // () => void

  // Estado atual
  toasts, // Toast[]
} = useToast();
```

## ⚙️ Configurações

### Duração Padrão

- **Padrão**: 5000ms (5 segundos)
- **Customizável**: Passe como último parâmetro
- **Persistente**: Use `0` para não remover automaticamente

```jsx
// Duração padrão (5s)
success('Mensagem padrão');

// Duração customizada (10s)
success('Mensagem longa', 10000);

// Toast persistente (não remove automaticamente)
error('Erro crítico', 0);
```

### Estrutura do Toast Object

```typescript
interface Toast {
  id: number; // Timestamp único
  message: string; // Texto da mensagem
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number; // Duração em ms (0 = persistente)
}
```

## 🎨 Estilização

### Classes Tailwind Aplicadas

```jsx
// Container do toast
'flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 transition-all duration-300 ease-in-out animate-in slide-in-from-right';

// Ícone do toast (varia por tipo)
'inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg';

// Botão de fechar
'ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8';
```

### Cores por Tipo

```scss
// Success
.text-green-500 .bg-green-100
.dark:bg-green-800 .dark:text-green-200

// Error
.text-red-500 .bg-red-100
.dark:bg-red-800 .dark:text-red-200

// Warning
.text-yellow-500 .bg-yellow-100
.dark:bg-yellow-800 .dark:text-yellow-200

// Info
.text-blue-500 .bg-blue-100
.dark:bg-blue-800 .dark:text-blue-200
```

## 🎭 Animações

### Entrada

- **Classe**: `animate-in slide-in-from-right`
- **Efeito**: Desliza da direita para a esquerda
- **Duração**: 300ms (transition-all duration-300)

### Saída

- **Comportamento**: Fade out natural do React
- **Duração**: Controlada pelo `transition-all duration-300`

## 🧪 Testes

### Testes Implementados

```javascript
// src/providers/ToastProvider.test.js
describe('ToastProvider', () => {
  it('should render success toast when success is called');
  it('should render error toast when error is called');
  it('should render warning toast when warning is called');
  it('should render info toast when info is called');
  it('should remove toast when close button is clicked');
  it('should remove all toasts when removeAllToasts is called');
  it('should auto-remove toast after duration');
  it('should throw error when useToast is used outside ToastProvider');
  it('should render multiple toasts simultaneously');
});
```

### Como Testar

```bash
# Executar testes
npm test ToastProvider

# Executar testes com coverage
npm run test:coverage -- ToastProvider
```

## 📱 Responsividade

### Breakpoints

- **Desktop**: Canto superior direito fixo
- **Mobile**: Mantém posição, ajusta largura automaticamente
- **Largura máxima**: `max-w-xs` (320px)

### Adaptações Mobile

- Toasts se ajustam automaticamente à largura da tela
- Mantêm padding e margem consistentes
- Z-index alto garante visibilidade sobre outros elementos

## 🔧 Customização Avançada

### Adicionando Novos Tipos

```jsx
// No ToastProvider.js, adicione novo tipo
const getIconColor = type => {
  switch (type) {
    case 'custom':
      return 'text-purple-500 bg-purple-100 dark:bg-purple-800 dark:text-purple-200';
    // ... outros casos
  }
};

// Adicione método de conveniência
const custom = useCallback(
  (message, duration) => {
    return addToast(message, 'custom', duration);
  },
  [addToast]
);
```

### Customizando Posição

```jsx
// Altere o container no ToastProvider.js
<div className="fixed top-4 left-4 z-50 space-y-2"> {/* Canto superior esquerdo */}
<div className="fixed bottom-4 right-4 z-50 space-y-2"> {/* Canto inferior direito */}
<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 space-y-2"> {/* Centro */}
```

### Customizando Duração Global

```jsx
// No ToastProvider.js
const addToast = useCallback((message, type = 'info', duration = 3000) => { // 3s ao invés de 5s
```

## 🎯 Exemplos Práticos

### Integração com API Calls

```jsx
import { useToast } from '@/providers/ToastProvider';
import { api } from '@/services/api';

function UserForm() {
  const { success, error } = useToast();

  const handleSubmit = async userData => {
    try {
      await api.post('/users', userData);
      success('Usuário criado com sucesso!');
    } catch (err) {
      error('Erro ao criar usuário: ' + err.message);
    }
  };
}
```

### Integração com React Query

```jsx
import { useToast } from '@/providers/ToastProvider';
import { useMutation } from '@tanstack/react-query';

function useCreateUser() {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      success('Usuário criado com sucesso!');
    },
    onError: err => {
      error('Erro ao criar usuário: ' + err.message);
    },
  });
}
```

### Toast com Loading State

```jsx
function AsyncOperation() {
  const { info, success, error, removeToast } = useToast();

  const handleOperation = async () => {
    const loadingToastId = info('Processando...', 0); // Toast persistente

    try {
      await someAsyncOperation();
      removeToast(loadingToastId);
      success('Operação concluída!');
    } catch (err) {
      removeToast(loadingToastId);
      error('Operação falhou!');
    }
  };
}
```

## 🐛 Solução de Problemas

### Toast não aparece

1. Verifique se `ToastProvider` está envolvendo seu componente
2. Confirme se está importando `useToast` corretamente
3. Verifique se não há erro no console

### Toast não remove automaticamente

1. Verifique se a duração não está definida como `0`
2. Confirme se não há erro que impeça o setTimeout
3. Verifique se o componente não está sendo re-renderizado constantemente

### Múltiplos toasts não aparecem

1. Verifique se não há conflito de z-index
2. Confirme se o container tem `space-y-2` para espaçamento
3. Verifique se não há CSS conflitante

## 🎯 Benefícios

- ✅ **Não intrusivo**: Não bloqueia a interface
- ✅ **Acessível**: Suporte a screen readers com `role="alert"`
- ✅ **Responsivo**: Funciona em todos os tamanhos de tela
- ✅ **Customizável**: Fácil de estender e personalizar
- ✅ **Performático**: Remoção automática previne vazamentos de memória
- ✅ **Testável**: Cobertura completa de testes
- ✅ **Tipado**: Suporte completo ao TypeScript (quando aplicável)
