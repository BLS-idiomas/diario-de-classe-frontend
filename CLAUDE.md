# CLAUDE.md — Frontend (Diário de Classe)

Regras para manter o padrão do frontend. Next.js 16 (App Router) + React 19 + Redux Toolkit, **JavaScript puro** (`.js`/`.jsx`, sem TypeScript).

> Não rodar `git` sem o usuário pedir.

## Stack

- **Next.js 16** (App Router), **React 19**, arquivos `.jsx` para componentes.
- **Redux Toolkit** (slices + async thunks) para estado de servidor/domínio. React Query está instalado mas **não é o padrão** — usar Redux.
- **Axios** via classes de API. **Tailwind CSS 4** com classes semânticas.
- Formulários: hooks próprios (`use<Entidade>Form`), **sem** react-hook-form/Formik/Zod.
- **Jest + Testing Library** (testes co-located `*.test.jsx`). ESLint 9 (`next/core-web-vitals`) + Prettier + Husky/lint-staged.
- Ícones: `lucide-react`. Alerts: `sweetalert2` (via `useSweetAlert`).

## Estrutura

```
src/
  app/(application)/   # rotas privadas (layout compartilhado)   -> page.jsx por rota
  app/(auth)/          # rotas públicas (login, forgotPassword)
  components/ui/       # componentes genéricos (Fields, Section, Form...)
  components/app/      # componentes de domínio
  components/page/     # FormPage / ListPage
  services/<dominio>/  # classes *Service (wrapper de API)
  store/api/           # BaseApi -> AuthenticatedApi -> AbstractEntityApi -> <Entidade>Api
  store/slices/        # <dominio>Slice.js (RTK)
  hooks/<dominio>/     # use<Coisa>.js
  providers/           # Context providers (UserAuthProvider, ThemeProvider...)
  constants/  utils/
```

## Fluxo de dados (camadas)

```
<Entidade>Api (store/api)  →  <Operacao>Service (services)  →  asyncThunk (store/slices)  →  use<Dominio> hook  →  componente
```

### Nova entidade / operação

1. **API** (`store/api/<entidade>Api.js`) — estende `AbstractEntityApi`, só implementa `getEndpoint()`:
   ```js
   export class DiaAulaApi extends AbstractEntityApi {
     getEndpoint() {
       return '/dias-aulas';
     }
   }
   ```
   Já ganha `getAll/getById/create/update/delete` + token via `AuthenticatedApi`.
2. **Service** (`services/<dominio>/<operacao><Entidade>Service.js`) — padrão `execute()` + `static handle()`:
   ```js
   export class GetDiaAulaByIdService {
     constructor(api) {
       this.api = api;
     }
     async execute(id) {
       return await this.api.getById(id);
     }
     static async handle(id) {
       return await new GetDiaAulaByIdService(new DiaAulaApi()).execute(id);
     }
   }
   ```
3. **Slice** (`store/slices/<dominio>Slice.js`) — `createAsyncThunk` chamando o Service; estado com `STATUS` (`IDLE/LOADING/SUCCESS/FAILED`), `list/current/errors/message/count`. Erros via `rejectWithValue({ message, statusError })`. Registrar o reducer em `store/index.js`.
4. **Hook** (`hooks/<dominio>/use<Coisa>.js`) — encapsula `useDispatch`/`useSelector`, faz o fetch inicial em `useEffect`, retorna dados + flags (`isLoading`) + funções. Componentes consomem o hook, não o Redux direto.

## Componentes

- **Arrow function + named export** (não `export default`, exceto `page.jsx`/`layout.jsx` que exigem default):
  ```jsx
  export const Section = ({ children }) => (
    <section className="bg-main rounded-md p-4 shadow-sm" data-testid="section">
      {children}
    </section>
  );
  ```
- Props desestruturadas com defaults (`isEdit = false`, `handleChange = () => {}`).
- Pasta por componente com `index.jsx` (`components/ui/Section/index.jsx`); barrel export em `components/index.js` e `@/components/ui`.
- **`data-testid`** em elementos-chave (usado nos testes).
- Componente de página interativa começa com `'use client';`.
- Reusar `components/ui/Fields/*` (InputField, SelectField, PasswordField, BaseField) em formulários — não recriar inputs.

## Formulários

Hook `use<Entidade>Form` com `useState`, `handleChange` genérico por `name`, `handleSubmit` que faz `preventDefault` e delega ao callback `submit`:

```js
const handleChange = e => {
  const { name, value } = e.target;
  setFormData(p => ({ ...p, [name]: value }));
};
```

## Nomenclatura

| Item               | Padrão                                                           |
| ------------------ | ---------------------------------------------------------------- |
| Componente         | `PascalCase`, named export, pasta `PascalCase/index.jsx`         |
| Hook               | `use<Coisa>` (camelCase)                                         |
| Service            | `<Operacao><Entidade>Service` (PascalCase)                       |
| API class          | `<Entidade>Api`                                                  |
| Slice              | `<dominio>Slice.js`; thunks = verbo (`getAlunos`, `createAluno`) |
| Constants          | `UPPER_SNAKE` (`STATUS`, `TIPO_AULA_LABEL`)                      |
| Pastas             | `kebab-case` (`dias-aulas`)                                      |
| Props bool/handler | `is*`/`has*`, `handle*`/`on*`                                    |

## Estilização (Tailwind)

- Usar **classes semânticas** definidas em `app/globals.css` em vez de cores cruas: `bg-main`, `bg-secondary`, `text-main`, `text-muted`, `border-main`, `primary-color`; botões `.btn` + `.btn-primary/secondary/danger/success`.
- Layout com Tailwind vanilla (`grid`, `flex`, `gap`, `p-`, `mb-`, responsivo `md:`/`lg:`).
- Dark mode via `[data-theme='dark']` (ThemeProvider) — não hardcodar cores que quebrem o tema.

## Testes

- Co-located `*.test.jsx`/`.test.js` ao lado do arquivo. `describe`/`it`, `render`+`screen` de Testing Library, `jest.fn()` para mocks, `beforeEach` para setup.
- Testar rendering, classes relevantes e comportamento. Selecionar por `data-testid`/texto.
- Ao criar componente/hook/util novo, adicionar teste no mesmo estilo.

## Config / env

- Env pública com prefixo `NEXT_PUBLIC_` (ex.: `NEXT_PUBLIC_API_URL`). `BaseApi` lê a URL com fallback para localhost. Manter `.env.example`.
- Token guardado em `localStorage` (`token`) e injetado como `Bearer` por `AuthenticatedApi`. Acesso SSR-safe (`typeof window !== 'undefined'`).
