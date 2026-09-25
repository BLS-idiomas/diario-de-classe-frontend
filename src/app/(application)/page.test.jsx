import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { act } from 'react';
import { JSDOM } from 'jsdom';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { mountRaw } from '@/utils/mountRaw';
import Home from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import { makeFullNameLabel } from '@/utils/makeFullNameLabel';
import {
  FILTER_PANEL_STORAGE_KEYS,
  FILTER_STORAGE_KEYS,
  STATUS,
} from '@/constants';

// Mock providers and hooks
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/dashboard/useDashboard');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/utils/makeEmailLabel');
jest.mock('@/utils/makeFullNameLabel');

// Colaboradores exigidos só pela prova de fiação real abaixo (AC-001-015/018/
// 021 e invariante de cablagem): a suíte principal desta descrição mantém
// `useDashboard` inteiramente mockado (bloco acima) e nunca invoca estes
// módulos; só o describe de fiação troca `useDashboard` para
// `jest.requireActual`, e é o hook real que os importa.
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/dashboardSlice', () => ({
  getDashboard: jest.fn(() => ({ type: 'dashboard/getDashboard' })),
}));
jest.mock('@/store/slices/aulasSlice', () => ({
  updateAula: jest.fn(() => ({ type: 'aulas/updateAula' })),
  clearStatus: jest.fn(() => ({ type: 'aulas/clearStatus' })),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(() => ({ success: jest.fn(), error: jest.fn() })),
}));
jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(() => ({ showForm: jest.fn(), showSuccess: jest.fn() })),
}));

describe('Home Page - Dashboard', () => {
  const defaultMocks = {
    currentUser: { id: 1, nome: 'Professor Test', email: 'test@example.com' },
    isAdmin: () => true,
  };

  const defaultDashboardData = {
    alunosCount: 25,
    aulasCount: 12,
    contratosCount: 5,
    aulas: [],
    isLoading: false,
    homeCardValues: [
      { title: 'Alunos', value: 25, color: 'blue' },
      { title: 'Aulas', value: 12, color: 'green' },
      { title: 'Contratos', value: 5, color: 'purple' },
    ],
    formData: {
      dataInicio: '',
      dataTermino: '',
      tipo: '',
      alunoId: '',
      professorId: '',
    },
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue(defaultMocks);
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      searchParams: {},
    });
    useDashboard.mockReturnValue(defaultDashboardData);
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
    });
  });

  it('renders dashboard without errors', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders page with form if user is admin', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(useUserAuth).toHaveBeenCalled();
    });
  });

  it('displays loading state when dashboard is loading', () => {
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      isLoading: true,
    });

    render(<Home />);
    expect(useUserAuth).toHaveBeenCalled();
  });

  it('renders with dashboard data', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(useDashboard).toHaveBeenCalled();
    });
  });

  it('conclui a apresentação com o fallback já existente quando getDashboard rejeita, sem indicador preso (AC-002-004)', () => {
    // Shape do estado pós-rejeição em `dashboardSlice.js`: STATUS.FAILED
    // não preenche `data`, então `isLoading` fica `false` e `aulas`/valores
    // dos cards ficam sem valor (`useDashboard.js`).
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      aulas: null,
      isLoading: false,
      homeCardValues: [
        { title: 'Alunos', value: undefined, color: 'blue' },
        { title: 'Aulas', value: undefined, color: 'green' },
        { title: 'Contratos', value: undefined, color: 'purple' },
      ],
    });

    render(<Home />);

    expect(screen.getByText('Nenhuma aula encontrada')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // Cards sem valor (rejeição não preenche `data`): mostram "0", nunca o
    // placeholder de carregamento "...".
    expect(screen.queryByText('...')).not.toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });

  it('aplica animate-block-in no valor de cada card (o nó que efetivamente troca) e na lista de aulas quando o carregamento conclui, mas nunca na moldura do grid, que persiste entre os dois estados (COMP-003-001, AC-002-001)', () => {
    const { container } = render(<Home />);

    // Seletor por substring de classe estável (nunca por classe exata): a
    // classe alvo (`animate-block-in`) é composta condicionalmente e não pode
    // fazer parte do próprio seletor sem esvaziar a prova.
    const grid = container.querySelector('[class*="grid-cols-1"]');
    const valores = grid.querySelectorAll('[class*="text-3xl"]');
    const lista = container.querySelector('[class*="space-y-4"]');

    // A moldura do grid (fundo, borda, sombra, título) é o mesmo nó DOM
    // entre `isLoading: true` e `false` — se ganhasse a classe aqui, o
    // keyframe `block-in` (que começa em opacity: 0) faria os 3 cards
    // sumirem e reaparecerem por inteiro.
    expect(grid).not.toHaveClass('animate-block-in');

    expect(valores).toHaveLength(3);
    valores.forEach(valor => expect(valor).toHaveClass('animate-block-in'));
    expect(lista).toHaveClass('animate-block-in');
  });

  it('não aplica animate-block-in no valor dos cards nem na lista de aulas enquanto isLoading é true (COMP-003-001)', () => {
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      isLoading: true,
    });

    const { container } = render(<Home />);

    const grid = container.querySelector('[class*="grid-cols-1"]');
    const valores = grid.querySelectorAll('[class*="text-3xl"]');
    const lista = container.querySelector('[class*="space-y-4"]');

    expect(valores).toHaveLength(3);
    valores.forEach(valor => expect(valor).not.toHaveClass('animate-block-in'));
    expect(lista).not.toHaveClass('animate-block-in');
  });

  it('não deixa o texto da aula forçar a largura do row em telas estreitas (guarda de configuração — min-w-0/flex-1 no container; scrollWidth real não é medível em jsdom, ver gate 9/qa)', () => {
    makeFullNameLabel.mockReturnValue(
      'joaozinhodasilvaoliveiraferreiraresponsividade'
    );
    makeEmailLabel.mockReturnValue(
      'joaozinhodasilvaoliveiraferreiraresponsividade@example.com'
    );
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      aulas: [
        {
          id: 1,
          aluno: {
            nome: 'joaozinhodasilvaoliveiraferreiraresponsividade',
            sobrenome: '',
          },
          professor: {
            email: 'joaozinhodasilvaoliveiraferreiraresponsividade@example.com',
          },
          tipo: 'PADRAO',
          status: 'AGENDADA',
          dataAula: '2026-01-01',
          horaInicial: '2026-01-01T10:00:00',
          horaFinal: '2026-01-01T11:00:00',
        },
      ],
    });

    const { container } = render(<Home />);

    const textoDaLinha = container.querySelector(
      '.flex.items-center.gap-5 > div:last-child'
    );

    expect(textoDaLinha).toHaveClass('min-w-0');
    expect(textoDaLinha).toHaveClass('flex-1');

    const textosDeUsuario = textoDaLinha.querySelectorAll('p');
    // Guarda de configuração (F3): confirma que os `<p>` que renderizam nome
    // do aluno e nome/email do professor (dado de origem do usuário, sem
    // espaço) têm `break-words`. `min-w-0`/`flex-1` no ancestral flex é
    // condição necessária mas não suficiente para conter um token sem
    // espaço — não mede `scrollWidth` real (limitação de jsdom); a medição
    // de efeito de layout fica para o gate 9 (qa, Playwright).
    expect(textosDeUsuario[0]).toHaveClass('break-words');
    expect(textosDeUsuario[1]).toHaveClass('break-words');
  });

  it('mantém os 3 cartões de resumo empilhados em coluna única por padrão', () => {
    const { container } = render(<Home />);

    expect(container.querySelector('.grid.grid-cols-1')).toBeInTheDocument();
    expect(
      screen.getAllByText(/Alunos|Aulas|Contratos/).length
    ).toBeGreaterThanOrEqual(3);
  });
});

describe('HomeInfoCard — tempo relativo estável até montar (AC-001-004)', () => {
  const defaultMocks = {
    currentUser: { id: 1, nome: 'Professor Test', email: 'test@example.com' },
    isAdmin: () => true,
  };

  // Aula a poucos minutos de começar em relação ao instante fixado no teste de
  // preenchimento (2026-06-15T13:00:00.000Z) — produz texto não-vazio via getTimeText.
  const aulaFixture = {
    id: 99,
    tipo: 'PADRAO',
    status: 'AGENDADA',
    dataAula: '2026-06-15T12:00:00.000Z',
    horaInicial: '2026-06-15T13:05:00.000Z',
    horaFinal: '2026-06-15T14:00:00.000Z',
    aluno: { nome: 'Aluno Teste' },
    professor: { email: 'prof@example.com' },
  };

  const dashboardDataComAula = {
    alunosCount: 1,
    aulasCount: 1,
    contratosCount: 0,
    aulas: [aulaFixture],
    isLoading: false,
    homeCardValues: [],
    formData: {
      dataInicio: '',
      dataTermino: '',
      tipo: '',
      alunoId: '',
      professorId: '',
    },
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue(defaultMocks);
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      searchParams: {},
    });
    useDashboard.mockReturnValue(dashboardDataComAula);
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
    });
    makeFullNameLabel.mockReturnValue('Aluno Teste');
    makeEmailLabel.mockReturnValue('prof@example.com');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('paridade SSR: renderToString produz o mesmo placeholder independente do horário do sistema', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-15T09:00:00.000Z'));
    const htmlAntes = renderToString(<Home />);

    jest.setSystemTime(new Date('2026-12-25T23:59:00.000Z'));
    const htmlDepois = renderToString(<Home />);

    expect(htmlAntes).toBe(htmlDepois);
    expect(htmlAntes).not.toMatch(/minuto\(s\)|hora\(s\)|Amanhã|Em andamento/);
  });

  it('preenchimento pós-montagem: o texto passa a refletir getTimeText calculado no instante T', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-15T13:00:00.000Z'));

    // `mountRaw` (ACH-10) — mesmo helper compartilhado das 5 suítes de hook,
    // aqui montando o componente diretamente (sem `Harness`). Nota: desde que
    // `Home` também renderiza `PainelFiltrosColapsavel` (lote de filtros),
    // que tem o próprio `useLayoutEffect` (`setHidratado`), o commit inicial
    // já força o assentamento do efeito passivo de `HomeInfoCard`
    // (`setTime`) antes de `mountRaw` retornar — não sobra mais o frame
    // síncrono "ainda em branco" que existia com a árvore isolada. A
    // paridade SSR real (o que importa para o AC) continua provada pelo
    // teste `renderToString` acima: o HTML do servidor nunca carrega o texto
    // volátil.
    const home = mountRaw(<Home />);

    await home.flush();

    expect(home.container.textContent).toMatch('Em 5 minuto(s)');

    home.unmount();
  });
});

describe('Home — fiação real do painel colapsável (AC-001-015/018/021, achado B3 do qa)', () => {
  const actualUseDashboard = jest.requireActual(
    '@/hooks/dashboard/useDashboard'
  ).useDashboard;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor Test' },
      isAdmin: () => true,
    });
    useAlunos.mockReturnValue({ alunoOptions: [], isLoading: false });
    useProfessores.mockReturnValue({ professorOptions: [], isLoading: false });

    // Troca `useDashboard` (auto-mockado no describe acima) pela implementação
    // real: só assim um bug isolado no cálculo/repasse de `appliedCount` em
    // `useDashboard` reprova estes testes, como o critério exige.
    useDashboard.mockImplementation(actualUseDashboard);
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation(selector =>
      selector({
        dashboard: { data: {}, status: 'idle' },
        aulas: { status: 'idle', action: null },
      })
    );
  });

  it('localStorage pré-semeado (painel recolhido + 2 filtros não-default): painel já recolhido e contagem "2", sem nenhuma interação', () => {
    localStorage.setItem(
      FILTER_PANEL_STORAGE_KEYS.dashboard,
      JSON.stringify('recolhido')
    );
    localStorage.setItem(
      FILTER_STORAGE_KEYS.dashboard,
      JSON.stringify({ alunoId: '123', professorId: '456' })
    );

    render(<Home />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).toHaveAttribute(
      'data-panel-state',
      'recolhido'
    );
    expect(screen.getByTestId('painel-filtros-contagem')).toHaveTextContent(
      '2'
    );
  });

  it('sem preferência salva e sem filtro aplicado: painel aberto e sem indicação de contagem', () => {
    render(<Home />);

    expect(screen.getByTestId('painel-filtros-colapsavel')).not.toHaveAttribute(
      'data-panel-state'
    );
    expect(
      screen.queryByTestId('painel-filtros-contagem')
    ).not.toBeInTheDocument();
  });

  it('um único "Filtros" no painel inicial (mesma regra da TASK-002-005): com o painel aberto, o heading nível 3 aparece exatamente uma vez', () => {
    render(<Home />);

    expect(
      screen.getAllByRole('heading', { name: 'Filtros', level: 3 })
    ).toHaveLength(1);
  });

  describe('INVARIANTE DE CABLAGEM (herdado do re-review da wave 2, DEC-002-001 §6): isOpen vem de useCollapsiblePanelState(a MESMA storageKey do painel)', () => {
    function montarMarkupDeServidor() {
      // Simula o servidor (A-001-001: sempre aberto lá, por não haver
      // localStorage nenhum): limpa o localStorage do próprio ambiente Jest —
      // é ele que o código de produção lê via `window`/`localStorage`
      // ambientes, inclusive durante a hidratação abaixo — antes de gerar o
      // markup estático.
      localStorage.clear();
      return renderToString(<Home />);
    }

    it('preferência salva "recolhido": o atributo aplicado pelo script anti-flash sobrevive à hidratação (isOpen inicial vem do hook, não diverge) e some ao expandir', () => {
      const markup = montarMarkupDeServidor();
      const html = `<!DOCTYPE html><html><body><div id="root">${markup}</div></body></html>`;

      // Ambiente jsdom AMBIENTE (o próprio realm do Jest): é dele que o código
      // de produção (useCollapsiblePanelState -> filterStorage.js) lê
      // `localStorage` durante a hidratação abaixo — precisa ter a MESMA
      // preferência que o script inline (que roda no realm do documento
      // isolado, criado a seguir) vai encontrar.
      localStorage.setItem(
        FILTER_PANEL_STORAGE_KEYS.dashboard,
        JSON.stringify('recolhido')
      );

      // Documento isolado, com o parser REAL (lição
      // [[prova-de-script-inline-precisa-do-parser-real]]): o script
      // anti-flash embutido no markup executa durante o parse, antes de
      // qualquer hidratação, e sua própria leitura de localStorage é a deste
      // realm isolado — semeada aqui via `beforeParse`.
      const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'https://invariante-cablagem-dashboard.teste/',
        beforeParse(janela) {
          janela.localStorage.setItem(
            FILTER_PANEL_STORAGE_KEYS.dashboard,
            JSON.stringify('recolhido')
          );
        },
      });

      const raizAntesDeHidratar = dom.window.document.querySelector(
        '[data-testid="painel-filtros-colapsavel"]'
      );
      // pré-condição: o script já aplicou o atributo, exatamente como em
      // produção, antes de qualquer código React rodar.
      expect(raizAntesDeHidratar.getAttribute('data-panel-state')).toBe(
        'recolhido'
      );

      const container = dom.window.document.getElementById('root');

      // Hidrata a árvore real. `renderToString`/`hydrateRoot` não corrigem
      // atributos divergentes entre o markup do servidor e o valor computado
      // no cliente durante a própria hidratação — por isso a asserção que de
      // fato discrimina cablagem correta de incorreta não é o estado logo
      // após hidratar, e sim a interação seguinte.
      let root;
      expect(() => {
        act(() => {
          root = hydrateRoot(container, <Home />);
        });
      }).not.toThrow();

      const raizDepoisDeHidratar = dom.window.document.querySelector(
        '[data-testid="painel-filtros-colapsavel"]'
      );
      // NFR-001-002: o atributo que oculta o conteúdo via CSS continua
      // presente logo após a hidratação — nenhum frame mostra os campos.
      expect(raizDepoisDeHidratar.getAttribute('data-panel-state')).toBe(
        'recolhido'
      );

      // Clica no controle (por `data-testid`, nunca pelo aria-label — o
      // rótulo pode estar preso ao valor do servidor logo após hidratar).
      // Se `isOpen` vier de `useCollapsiblePanelState(FILTER_PANEL_STORAGE_KEYS.dashboard)`
      // (cablagem correta), o estado interno já era `false`; o clique o
      // inverte para `true`, e a reconciliação normal que segue (fora da
      // hidratação) remove o atributo da raiz. Mutante (isOpen de um
      // `useState(true)` local, dissociado da chave): o estado interno já
      // seria `true`, e o clique o inverteria para `false` — o atributo
      // NUNCA sairia da raiz, reprovando esta asserção.
      const botao = within(dom.window.document.body).getByTestId(
        'painel-filtros-controle'
      );
      act(() => {
        botao.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
      });

      const raizDepoisDeExpandir = dom.window.document.querySelector(
        '[data-testid="painel-filtros-colapsavel"]'
      );
      expect(raizDepoisDeExpandir.getAttribute('data-panel-state')).toBeNull();

      act(() => {
        root.unmount();
      });
    });
  });
});

describe('Home — isLoading/errorMessage de useAlunos()/useProfessores() chegam ao SearchableSelectField real', () => {
  const defaultMocks = {
    currentUser: { id: 1, nome: 'Professor Test', email: 'test@example.com' },
    isAdmin: () => true,
  };

  const defaultDashboardData = {
    aulas: [],
    isLoading: false,
    homeCardValues: [],
    formData: {
      dataInicio: '',
      dataTermino: '',
      tipo: '',
      status: '',
      alunoId: '',
      professorId: '',
      minhasAulas: false,
    },
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleClearFilter: jest.fn(),
    handleClick: jest.fn(),
    appliedCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue(defaultMocks);
    useDashboard.mockReturnValue(defaultDashboardData);
  });

  it('useAlunos() com isLoading=true: o combobox real de Aluno mostra o indicador de carregamento ao abrir, não "Nenhum resultado encontrado"', () => {
    useAlunos.mockReturnValue({
      alunoOptions: [],
      isLoading: true,
      status: STATUS.LOADING,
      action: 'getAlunos',
    });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(
      screen.queryByTestId('searchable-select-field-empty')
    ).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED da ação getAlunos: o combobox real de Aluno mostra a frase fixa em pt-BR, nunca o `message` cru do slice', () => {
    useAlunos.mockReturnValue({
      alunoOptions: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'getAlunos',
      message: 'Request failed with status code 500',
    });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(
      screen.getByTestId('searchable-select-field-error')
    ).toHaveTextContent(
      'Não foi possível carregar os alunos. Tente novamente.'
    );
    expect(screen.queryByText(/request failed/i)).not.toBeInTheDocument();
  });

  it('useProfessores() com isLoading=true: o combobox real de Professor mostra o indicador de carregamento ao abrir', () => {
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({
      professorOptions: [],
      isLoading: true,
      status: STATUS.LOADING,
      action: 'getProfessores',
    });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('useProfessores() com status FAILED da ação getProfessores: o combobox real de Professor mostra a frase fixa em pt-BR, nunca o `message` cru do slice', () => {
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({
      professorOptions: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'getProfessores',
      message: 'Request failed with status code 500',
    });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));

    expect(
      screen.getByTestId('searchable-select-field-error')
    ).toHaveTextContent(
      'Não foi possível carregar os professores. Tente novamente.'
    );
    expect(screen.queryByText(/request failed/i)).not.toBeInTheDocument();
  });

  it('useProfessores() com status FAILED de outra ação do slice (ex.: updateProfessor): o combobox real NÃO mostra erro — status é compartilhado entre ações do slice', () => {
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({
      professorOptions: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'updateProfessor',
    });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));

    expect(
      screen.queryByTestId('searchable-select-field-error')
    ).not.toBeInTheDocument();
  });

  it('useAlunos() com status FAILED de outra ação do slice (ex.: updateAluno): o combobox real NÃO mostra erro — status é compartilhado entre ações do slice', () => {
    useAlunos.mockReturnValue({
      alunoOptions: [],
      isLoading: false,
      status: STATUS.FAILED,
      action: 'updateAluno',
    });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));

    expect(
      screen.queryByTestId('searchable-select-field-error')
    ).not.toBeInTheDocument();
  });

  it('selecionar uma opção de Aluno chama handleChange com { target: { name: "alunoId", value } }', () => {
    const handleChange = jest.fn();
    useDashboard.mockReturnValue({ ...defaultDashboardData, handleChange });
    useAlunos.mockReturnValue({
      alunoOptions: [{ label: 'João Silva', value: 'cuid-aluno-1' }],
    });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^aluno$/i }));
    fireEvent.click(screen.getByRole('option', { name: 'João Silva' }));

    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'alunoId', value: 'cuid-aluno-1' },
    });
  });

  it('selecionar uma opção de Professor chama handleChange com { target: { name: "professorId", value } }', () => {
    const handleChange = jest.fn();
    useDashboard.mockReturnValue({ ...defaultDashboardData, handleChange });
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({
      professorOptions: [
        { label: 'Pedro Oliveira', value: 'cuid-professor-1' },
      ],
    });

    render(<Home />);
    fireEvent.click(screen.getByRole('combobox', { name: /^professor/i }));
    fireEvent.click(screen.getByRole('option', { name: 'Pedro Oliveira' }));

    expect(handleChange).toHaveBeenCalledWith({
      target: { name: 'professorId', value: 'cuid-professor-1' },
    });
  });

  it('isAdmin()=true e formData.minhasAulas=true: o campo Professor não é renderizado (mesma condição do form, ramo ainda não coberto)', () => {
    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Admin Teste' },
      isAdmin: () => true,
    });
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      formData: { ...defaultDashboardData.formData, minhasAulas: true },
    });
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);

    expect(
      screen.queryByRole('combobox', { name: /^professor/i })
    ).not.toBeInTheDocument();
  });

  it('AC-001-008: com formData.alunoId/professorId apontando para um registro excluído (fora de `alunoOptions`/`professorOptions`), a home renderiza sem erro e sem descartar o valor em silêncio (fallback ao value bruto, sem `selectedLabel`)', () => {
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      formData: {
        ...defaultDashboardData.formData,
        alunoId: '999',
        professorId: '888',
      },
    });
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);

    expect(screen.getByRole('combobox', { name: /^aluno$/i }).value).toBe(
      '999'
    );
    expect(screen.getByRole('combobox', { name: /^professor/i }).value).toBe(
      '888'
    );
  });

  it('professor não-admin (isAdmin() === false): o campo Professor não é renderizado — comportamento pré-existente inalterado pelo wiring', () => {
    useUserAuth.mockReturnValue({
      currentUser: { id: 2, nome: 'Professor Comum' },
      isAdmin: () => false,
    });
    useAlunos.mockReturnValue({ alunoOptions: [] });
    useProfessores.mockReturnValue({ professorOptions: [] });

    render(<Home />);

    expect(
      screen.queryByRole('combobox', { name: /^professor/i })
    ).not.toBeInTheDocument();
  });
});
