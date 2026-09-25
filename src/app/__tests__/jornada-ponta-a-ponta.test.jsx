import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import AuthLayout from '../(auth)/layout';
import LoginPage from '../(auth)/login/page';
import ApplicationLayout from '../(application)/layout';
import AulasPage from '../(application)/aulas/page';
import EditarAulaPage from '../(application)/aulas/[id]/editar/page';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserAuthProvider } from '@/providers/UserAuthProvider';

import authReducer from '@/store/slices/authSlice';
import professoresReducer from '@/store/slices/professoresSlice';
import alunosReducer from '@/store/slices/alunosSlice';
import contratosReducer from '@/store/slices/contratosSlice';
import diasAulasReducer from '@/store/slices/diasAulasSlice';
import aulasReducer from '@/store/slices/aulasSlice';
import dashboardReducer from '@/store/slices/dashboardSlice';
import configuracaoReducer from '@/store/slices/configuracaoSlice';
import relatorioReducer from '@/store/slices/relatorioSlice';
import livrosReducer from '@/store/slices/livrosSlice';
import cronogramasReducer from '@/store/slices/cronogramasSlice';

import { LoiginService } from '@/services/auth/loginService';
import { GetAulaListService } from '@/services/aula/getAulaListService';
import { GetAulaByIdService } from '@/services/aula/getAulaByIdService';
import { UpdateAulaService } from '@/services/aula/updateAulaService';
import { GetAlunoListService } from '@/services/aluno/getAlunoListService';
import { GetProfessorListService } from '@/services/professor/getProfessorListService';
import { GetContratoListService } from '@/services/contrato/getContratoListService';

// Fronteira de rede duplicada (§7 do perfil): só *Api/*Service, nunca
// Sidebar/FormPage/Table (Escopo > Inclui, TASK-002-016).
jest.mock('@/services/auth/loginService', () => ({
  LoiginService: { handle: jest.fn() },
}));
jest.mock('@/services/aula/getAulaListService', () => ({
  GetAulaListService: { handle: jest.fn() },
}));
jest.mock('@/services/aula/getAulaByIdService', () => ({
  GetAulaByIdService: { handle: jest.fn() },
}));
jest.mock('@/services/aula/updateAulaService', () => ({
  UpdateAulaService: { handle: jest.fn() },
}));
jest.mock('@/services/aluno/getAlunoListService', () => ({
  GetAlunoListService: { handle: jest.fn() },
}));
jest.mock('@/services/professor/getProfessorListService', () => ({
  GetProfessorListService: { handle: jest.fn() },
}));
jest.mock('@/services/contrato/getContratoListService', () => ({
  GetContratoListService: { handle: jest.fn() },
}));

// `useSweetAlert` (COMP-002-018) não é o mecanismo real de confirmação desta
// jornada: `useEditarAula` confirma via `useToast().success` (SuccessToast),
// não via SweetAlert2.
// Mock aqui troca a MESMA técnica (mock + asserção de chamada, não de
// renderização) para o mecanismo que o código realmente usa.
const successToast = jest.fn();
jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(() => ({
    success: successToast,
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  })),
  ToastProvider: ({ children }) => children,
}));

// Router — o mesmo mockPush precisa sobreviver a todas as chamadas de
// `useRouter()` ao longo da jornada (login → drawer → editar), por isso vive
// fora do factory (referência estável, diferente do default de
// `jest.setup.js`, que cria um `jest.fn()` novo por chamada).
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/aulas',
  useParams: () => ({ id: '42' }),
}));

const ALUNO = {
  id: 1,
  nome: 'Ana',
  sobrenome: 'Silva',
  email: 'ana@example.com',
};
const PROFESSOR_ADMIN = {
  id: 2,
  nome: 'Bruno',
  sobrenome: 'Costa',
  email: 'bruno@example.com',
  permissao: 'admin',
};
const CONTRATO = {
  id: 3,
  idAluno: 1,
  status: 'ATIVO',
  idioma: 'INGLES',
  dataInicio: '2026-01-01',
  dataTermino: '2026-12-31',
};
const AULA_DO_DIA = {
  id: 42,
  aluno: ALUNO,
  professor: PROFESSOR_ADMIN,
  contrato: { id: 3, idioma: 'INGLES' },
  idAluno: 1,
  idProfessor: 2,
  idContrato: 3,
  dataAula: '2026-09-22T00:00:00.000Z',
  horaInicial: '08:00',
  horaFinal: '08:40',
  duracaoAula: 40,
  tipo: 'PADRAO',
  status: 'AGENDADA',
  observacao: 'Conteúdo original da aula.',
};

function createRealStore() {
  return configureStore({
    reducer: {
      relatorio: relatorioReducer,
      livros: livrosReducer,
      cronogramas: cronogramasReducer,
      configuracao: configuracaoReducer,
      dashboard: dashboardReducer,
      alunos: alunosReducer,
      professores: professoresReducer,
      contratos: contratosReducer,
      diasAulas: diasAulasReducer,
      aulas: aulasReducer,
      auth: authReducer,
    },
  });
}

function Providers({ store, children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <UserAuthProvider>{children}</UserAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

describe('Jornada ponta a ponta (AC-001-019, COMP-002-019)', () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    store = createRealStore();

    LoiginService.handle.mockResolvedValue({
      data: {
        user: PROFESSOR_ADMIN,
        configuracao: {
          duracaoAula: 40,
          tolerancia: 10,
          diasDeFuncionamento: [],
        },
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      },
    });
    GetAulaListService.handle.mockResolvedValue({
      data: { data: [AULA_DO_DIA], count: 1, message: null },
    });
    GetAulaByIdService.handle.mockResolvedValue({ data: AULA_DO_DIA });
    UpdateAulaService.handle.mockResolvedValue({
      data: { ...AULA_DO_DIA, observacao: 'Observação atualizada.' },
    });
    GetAlunoListService.handle.mockResolvedValue({
      data: { data: [ALUNO], count: 1, message: null },
    });
    GetProfessorListService.handle.mockResolvedValue({
      data: { data: [PROFESSOR_ADMIN], count: 1, message: null },
    });
    GetContratoListService.handle.mockResolvedValue({
      data: { data: [CONTRATO], count: 1, message: null },
    });
  });

  it('compõe login → drawer → /aulas → editar → formulário → confirmação preservando o mesmo ApplicationLayout (não remontado)', async () => {
    // (1) login → dispara `useLogin`, resolve via `LoiginService` mockado.
    const { rerender } = render(
      <Providers store={store}>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Providers>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: PROFESSOR_ADMIN.email },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'segredo-de-teste' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: 'Entrar' }).closest('form')
    );

    // Asserção de composição 1: login completou e navegou para a área
    // autenticada — a mesma jornada que, em produção, leva à montagem do
    // ApplicationLayout (RTL não executa roteamento real; ver técnica
    // fixada, critério de pronto da TASK).
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));

    // (2) rerender no MESMO `render()`, sem desmontar `Providers` — troca só
    // o que estava sob `AuthLayout` pelo `ApplicationLayout` real, cujo
    // `useApplicationLayout` (isExpanded) é a instância viva cuja
    // persistência este teste prova.
    rerender(
      <Providers store={store}>
        <ApplicationLayout>
          <AulasPage />
        </ApplicationLayout>
      </Providers>
    );

    await waitFor(() => expect(GetAulaListService.handle).toHaveBeenCalled());

    // Abre a navegação global (drawer) — Header real, hambúrguer.
    fireEvent.click(screen.getByRole('button', { name: 'Abrir navegação' }));

    // Asserção de composição 2: o drawer abriu (FR-001-002).
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Fechar navegação' })
      ).toHaveAttribute('aria-expanded', 'true')
    );

    // Localiza a aula do dia pela coluna essencial "Data" e aciona a ação de
    // editar (coluna sticky-right).
    const dataDaAula = await screen.findByText('22/09/2026');
    const linha =
      dataDaAula.closest('[role="row"]') || dataDaAula.closest('tr');
    const linkEditar = within(linha).getAllByRole('link')[1];
    expect(linkEditar).toHaveAttribute('href', '/aulas/42/editar');

    // (3) rerender preservando o MESMO ApplicationLayout — troca só o
    // conteúdo (Aulas → EditarAula), sem desmontar a Sidebar/Header.
    rerender(
      <Providers store={store}>
        <ApplicationLayout>
          <EditarAulaPage />
        </ApplicationLayout>
      </Providers>
    );

    // Asserção de composição 3: o drawer, aberto no passo anterior, segue
    // aberto — prova de que `isExpanded`/`useApplicationLayout` é a MESMA
    // instância (não remontada) atravessando a troca Aulas → EditarAula.
    expect(
      screen.getByRole('button', { name: 'Fechar navegação' })
    ).toHaveAttribute('aria-expanded', 'true');

    // (4) preenche o formulário em coluna única (observação) e confirma.
    await waitFor(() =>
      expect(GetAulaByIdService.handle).toHaveBeenCalledWith('42')
    );
    const observacao = await screen.findByLabelText(/Conteúdo\/Observação/);
    fireEvent.change(observacao, {
      target: { value: 'Observação atualizada.' },
    });
    fireEvent.submit(screen.getByTestId('aula-form'));

    // Asserção de composição 4: o submit atravessou a cadeia real
    // (useAulaForm → useEditarAula → thunk → fronteira de rede mockada).
    await waitFor(() =>
      expect(UpdateAulaService.handle).toHaveBeenCalledWith(
        '42',
        expect.objectContaining({
          observacao: 'Observação atualizada.',
        })
      )
    );

    // (5) confirmação numa camada flutuante — via mock de `useToast`
    // (desvio declarado: `useEditarAula` confirma por `useToast().success`,
    // não por `useSweetAlert`), com asserção de invocação, não de render.
    await waitFor(() =>
      expect(successToast).toHaveBeenCalledWith(
        'Operação realizada com sucesso!'
      )
    );
  });
});
