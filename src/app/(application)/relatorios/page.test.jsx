import { render, screen, fireEvent, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JSDOM } from 'jsdom';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import Relatorios from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useRelatorios } from '@/hooks/relatorios/useRelatorios';
import { useRelatorioForm } from '@/hooks/relatorios/useRelatorioForm';
import { RELATORIOS_PANEL_STORAGE_KEY } from '@/constants';
import { PainelFiltrosColapsavel } from '@/components';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/relatorios/useRelatorios');
// COMP-002-007: o mock ENVOLVE a implementação real (`jest.requireActual`),
// nunca a reimplementa — lição `[Testes] Mock que copia a chamada, e não o
// contrato, fica verde sobre o bug`. `useRelatorioForm` não tem dependência
// externa (useState puro sobre `relatorio`/`submit`); envolvê-la permite
// isolar/observar chamadas sem nenhum risco de a assinatura mockada divergir
// da real (`{filtros, handleChange, handleSubmit}`, conferida contra
// `useRelatorioForm.js:48-52` antes de escrever este mock).
jest.mock('@/hooks/relatorios/useRelatorioForm', () => {
  const real = jest.requireActual('@/hooks/relatorios/useRelatorioForm');
  return {
    useRelatorioForm: jest.fn(real.useRelatorioForm),
  };
});

function makeRelatorio(overrides = {}) {
  return {
    title: 'Relatório de Aulas',
    description: 'Descrição do relatório de aulas',
    endpoint: 'relatorio-aulas',
    filters: [{ htmlFor: 'nome', label: 'Nome', type: 'text' }],
    ...overrides,
  };
}

describe('Relatorios Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: true,
    });

    useRelatorios.mockReturnValue({
      data: [],
      file: null,
      status: 'idle',
      isLoading: false,
    });
  });

  it('renders relatorios page', () => {
    render(<Relatorios />);
    expect(useRelatorios).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useRelatorios.mockReturnValue({
      data: [],
      file: null,
      status: 'idle',
      isLoading: true,
    });

    render(<Relatorios />);
    expect(useRelatorios).toHaveBeenCalled();
  });
});

describe('CardRelatorio — collapse por card (TASK-002-007, COMP-002-007)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: true,
    });
  });

  // `Storage.prototype` é global e compartilhado entre testes: um spy
  // (`jest.spyOn(Storage.prototype, 'setItem')`) que não for restaurado no
  // MESMO teste que o criou vaza para os seguintes, mesmo que o teste que o
  // criou falhe antes de chegar no `mockRestore()`. `afterEach` garante a
  // restauração independentemente do resultado do teste.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('AC-001-028: recolher o card mantém título/descrição visíveis e oculta só o bloco de geração, que permanece no DOM', () => {
    const relatorio = makeRelatorio();
    useRelatorios.mockReturnValue({
      data: [relatorio],
      submit: jest.fn(),
      isSubmitting: false,
    });

    render(<Relatorios />);

    expect(screen.getByText(relatorio.title)).toBeInTheDocument();
    expect(screen.getByText(relatorio.description)).toBeInTheDocument();

    const painel = screen.getByTestId('painel-filtros-colapsavel');
    // Sem appliedCount (SPEC §4.2, DEC-002-004/COMP-002-007): nunca há badge
    // de contagem em /relatorios, aberto ou recolhido.
    expect(
      screen.queryByTestId('painel-filtros-contagem')
    ).not.toBeInTheDocument();
    expect(painel).not.toHaveAttribute('data-panel-state');
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('painel-filtros-controle'));

    expect(painel).toHaveAttribute('data-panel-state', 'recolhido');
    // Lição `[Testes] Variante de grupo tem duas metades — asserte as duas`:
    // a raiz precisa carregar `group` E o atributo; sem a âncora `group`, a
    // ocultação por CSS nunca casa com nada, mas a suíte que só olha o filho
    // (abaixo) continuaria verde.
    expect(painel.classList.contains('group')).toBe(true);

    // Título/descrição continuam visíveis (fora do painel, DEC-002-004).
    expect(screen.getByText(relatorio.title)).toBeInTheDocument();
    expect(screen.getByText(relatorio.description)).toBeInTheDocument();

    // O bloco de geração inteiro (Form + botão "Gerar") permanece no DOM —
    // oculto por CSS via variante de descendente, nunca desmontado.
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeInTheDocument();
    const conteudo = screen.getByTestId('painel-filtros-conteudo');
    expect(conteudo).toContainElement(
      screen.getByRole('button', { name: 'Gerar' })
    );
    // Segunda metade do mesmo mecanismo: a classe da variante mora no FILHO
    // (o wrapper do conteúdo), não na raiz — `classList.contains`, nunca
    // substring. BRIEF-003: a ocultação deixou de ser por `display:none`
    // (`hidden`) — agora anima via `grid-template-rows` + `visibility`, para
    // permitir a transição CSS que `display` nunca interpola.
    expect(conteudo.classList.contains('hidden')).toBe(false);
    expect(
      conteudo.classList.contains(
        'group-data-[panel-state=recolhido]:grid-rows-[0fr]'
      )
    ).toBe(true);
    expect(
      conteudo.classList.contains(
        'group-data-[panel-state=recolhido]:invisible'
      )
    ).toBe(true);
  });

  it('COMP-002-007: CardRelatorio passa tagTitulo="h4" ao painel — o título "Filtros" renderiza h4, sob o h3 do card', () => {
    const relatorio = makeRelatorio();
    useRelatorios.mockReturnValue({
      data: [relatorio],
      submit: jest.fn(),
      isSubmitting: false,
    });

    render(<Relatorios />);

    expect(screen.getByTestId('painel-filtros-titulo').tagName).toBe('H4');
  });

  it('PainelFiltrosColapsavel: sem tagTitulo (superfície que não passa a prop), o título mantém o default h3', () => {
    render(
      <PainelFiltrosColapsavel
        titulo="Painel"
        isOpen={true}
        onToggle={() => {}}
        storageKey={null}
      >
        <div />
      </PainelFiltrosColapsavel>
    );

    expect(screen.getByTestId('painel-filtros-titulo').tagName).toBe('H3');
  });

  it('AC-001-023/024/025-parte/026/027: dois cards com endpoints distintos, sem preferência salva, abrem os dois; recolher o primeiro via teclado não afeta o segundo, que mantém seu campo preenchido e seu estado', async () => {
    const user = userEvent.setup();
    const relatorioA = makeRelatorio({
      endpoint: 'relatorio-a',
      title: 'Relatório A',
      description: 'Descrição A',
      filters: [{ htmlFor: 'campoA', label: 'Campo A', type: 'text' }],
    });
    const relatorioB = makeRelatorio({
      endpoint: 'relatorio-b',
      title: 'Relatório B',
      description: 'Descrição B',
      filters: [{ htmlFor: 'campoB', label: 'Campo B', type: 'text' }],
    });
    useRelatorios.mockReturnValue({
      data: [relatorioA, relatorioB],
      submit: jest.fn(),
      isSubmitting: false,
    });

    render(<Relatorios />);

    const paineis = screen.getAllByTestId('painel-filtros-colapsavel');
    expect(paineis).toHaveLength(2);
    paineis.forEach(painel =>
      expect(painel).not.toHaveAttribute('data-panel-state')
    );

    fireEvent.change(screen.getByLabelText('Campo A'), {
      target: { value: 'valor-a' },
    });
    fireEvent.change(screen.getByLabelText('Campo B'), {
      target: { value: 'valor-b' },
    });
    expect(screen.getByLabelText('Campo A')).toHaveValue('valor-a');
    expect(screen.getByLabelText('Campo B')).toHaveValue('valor-b');

    // Recolhe só o primeiro card, via teclado (foco + Enter — AC-001-024).
    const controleA = within(paineis[0]).getByTestId('painel-filtros-controle');
    controleA.focus();
    await user.keyboard('{Enter}');

    expect(paineis[0]).toHaveAttribute('data-panel-state', 'recolhido');
    // O segundo card mantém seu próprio estado (aberto) — não desmontou.
    expect(paineis[1]).not.toHaveAttribute('data-panel-state');
    expect(screen.getByLabelText('Campo A')).toHaveValue('valor-a');
    expect(screen.getByLabelText('Campo B')).toHaveValue('valor-b');

    // Persistência grava só a chave do endpoint alterado (merge, não
    // sobrescreve o mapa inteiro) — sob `filters_relatorios_panel`.
    const mapaSalvo = JSON.parse(
      localStorage.getItem(RELATORIOS_PANEL_STORAGE_KEY)
    );
    expect(mapaSalvo).toEqual({ [relatorioA.endpoint]: 'recolhido' });
  });

  it('AC-001-025 (FR-001-030): falha ao persistir a preferência de um card (localStorage.setItem lança) cai fail-secure sem travar a geração do outro card', () => {
    const submit = jest.fn();
    const relatorioA = makeRelatorio({
      endpoint: 'relatorio-a',
      title: 'Relatório A',
      description: 'Descrição A',
    });
    const relatorioB = makeRelatorio({
      endpoint: 'relatorio-b',
      title: 'Relatório B',
      description: 'Descrição B',
    });
    useRelatorios.mockReturnValue({
      data: [relatorioA, relatorioB],
      submit,
      isSubmitting: false,
    });

    render(<Relatorios />);

    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('boom');
      });

    const paineis = screen.getAllByTestId('painel-filtros-colapsavel');
    const controleA = within(paineis[0]).getByTestId('painel-filtros-controle');

    // fail secure: toggle() nunca propaga a exceção de escrita.
    expect(() => fireEvent.click(controleA)).not.toThrow();
    // Catch de `useCollapsiblePanelState.toggle` devolve `true` (aberto) —
    // o card não fica com estado indefinido nem trava a árvore.
    expect(paineis[0]).not.toHaveAttribute('data-panel-state');

    setItemSpy.mockRestore();

    // O outro card, nunca tocado pela falha, continua gerando normalmente.
    const botaoGerarB = within(paineis[1]).getByRole('button', {
      name: 'Gerar',
    });
    fireEvent.click(botaoGerarB);
    expect(submit).toHaveBeenCalledWith(
      relatorioB.endpoint,
      expect.any(Object)
    );
  });

  it('Restauração independente por card, sem remonte (achado B6 do qa): 2 cards semeados em estados diferentes já nascem restaurados na primeira renderização', () => {
    const relatorioRecolhido = makeRelatorio({
      endpoint: 'relatorio-recolhido',
      title: 'Recolhido',
      description: 'Descrição recolhido',
    });
    const relatorioAberto = makeRelatorio({
      endpoint: 'relatorio-aberto',
      title: 'Aberto',
      description: 'Descrição aberto',
    });
    // Semeia ANTES de montar — sem toggle() prévio, sem rerender.
    localStorage.setItem(
      RELATORIOS_PANEL_STORAGE_KEY,
      JSON.stringify({ [relatorioRecolhido.endpoint]: 'recolhido' })
    );
    useRelatorios.mockReturnValue({
      data: [relatorioRecolhido, relatorioAberto],
      submit: jest.fn(),
      isSubmitting: false,
    });

    render(<Relatorios />);

    const paineis = screen.getAllByTestId('painel-filtros-colapsavel');
    expect(paineis).toHaveLength(2);
    expect(paineis[0]).toHaveAttribute('data-panel-state', 'recolhido');
    expect(paineis[1]).not.toHaveAttribute('data-panel-state');
  });

  it('TRISK-002-003: relatorio com endpoint ausente/inválido não derruba a rota; o card nasce aberto e degrada para a chave literal "null" (dívida declarada, ver comentário de CardRelatorio)', () => {
    const relatorioSemEndpoint = makeRelatorio({ endpoint: undefined });
    useRelatorios.mockReturnValue({
      data: [relatorioSemEndpoint],
      submit: jest.fn(),
      isSubmitting: false,
    });

    // Sem a guarda de tipo em CardRelatorio, `itemId: undefined` chega ao
    // script anti-flash (`JSON.stringify(undefined).replace(...)` lança
    // `TypeError` durante o PRÓPRIO render, antes de qualquer execução no
    // browser) e a rota inteira (sem error.jsx/ErrorBoundary) quebraria.
    expect(() => render(<Relatorios />)).not.toThrow();

    expect(screen.getByText(relatorioSemEndpoint.title)).toBeInTheDocument();
    expect(
      screen.getByText(relatorioSemEndpoint.description)
    ).toBeInTheDocument();

    const painel = screen.getByTestId('painel-filtros-colapsavel');
    // Card nasce aberto (default): sem storageKey válida, não há
    // `data-panel-state` de recolhido.
    expect(painel).not.toHaveAttribute('data-panel-state');
    expect(screen.getByRole('button', { name: 'Gerar' })).toBeInTheDocument();
  });

  describe('INVARIANTE DE CABLAGEM (herdado do re-review da wave 2, DEC-002-001 §6): isOpen do card vem de useCollapsiblePanelState({ mapKey: RELATORIOS_PANEL_STORAGE_KEY, itemId: relatorio.endpoint })', () => {
    it('preferência salva "recolhido" para o endpoint do card: o atributo aplicado pelo script anti-flash sobrevive à hidratação e some ao expandir', () => {
      const relatorio = makeRelatorio();
      useRelatorios.mockReturnValue({
        data: [relatorio],
        submit: jest.fn(),
        isSubmitting: false,
      });

      // Harness real (medido dentro deste `renderToString`): `typeof window`
      // é `'object'`, `typeof localStorage` é `'object'` e
      // `localStorage.length` é `0` — o jsdom do Jest tem `localStorage`
      // PRESENTE e vazio, não ausente. Este `clear()` garante que não há
      // preferência salva para o endpoint do card, então o markup produzido
      // é o default aberto (A-001-001) — não a ausência real de
      // `localStorage` de um servidor, que não é reproduzível neste runner
      // (Restrição medida em [[teste-de-ambiente-simulado-inerte]]).
      localStorage.clear();
      const markup = renderToString(<Relatorios />);
      const html = `<!DOCTYPE html><html><body><div id="root">${markup}</div></body></html>`;

      // Realm AMBIENTE (o do Jest): é dele que `useCollapsiblePanelState`
      // lê `localStorage` durante a hidratação abaixo.
      localStorage.setItem(
        RELATORIOS_PANEL_STORAGE_KEY,
        JSON.stringify({ [relatorio.endpoint]: 'recolhido' })
      );

      // Documento isolado, parser REAL (lição
      // [[prova-de-script-inline-precisa-do-parser-real]]): o script
      // anti-flash embutido no markup executa durante o parse, com sua
      // própria leitura de localStorage semeada via `beforeParse`.
      const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'https://invariante-cablagem-relatorios.teste/',
        beforeParse(janela) {
          janela.localStorage.setItem(
            RELATORIOS_PANEL_STORAGE_KEY,
            JSON.stringify({ [relatorio.endpoint]: 'recolhido' })
          );
        },
      });

      const raizAntesDeHidratar = dom.window.document.querySelector(
        '[data-testid="painel-filtros-colapsavel"]'
      );
      expect(raizAntesDeHidratar.getAttribute('data-panel-state')).toBe(
        'recolhido'
      );

      const container = dom.window.document.getElementById('root');

      // `useRelatorioForm` é o contador de graça neste arquivo (`jest.fn`
      // envolvendo a implementação real, linha 21-26): 1 card montado chama
      // o hook 1x por render de `CardRelatorio`. `renderToString` (acima) já
      // contabilizou 1 chamada; a leitura abaixo, feita ANTES de
      // `hydrateRoot`, é o ponto de partida para medir o que muda entre as
      // duas leituras do DOM.
      const chamadasAntesDeHidratar = useRelatorioForm.mock.calls.length;

      let root;
      expect(() => {
        act(() => {
          root = hydrateRoot(container, <Relatorios />);
        });
      }).not.toThrow();

      // Medido: `hydrateRoot` dentro de `act()` produz exatamente 1 render
      // de `CardRelatorio` (delta de 1 chamada de `useRelatorioForm`) — é
      // esse commit de hidratação que muda o DOM entre `raizAntesDeHidratar`
      // (markup parseado pelo jsdom, pré-hidratação) e `raizDepoisDeHidratar`
      // abaixo. Sem essa medição, a segunda leitura seria a primeira de
      // novo, incapaz de falhar sozinha ([[comentario-de-teste-vale-como-asercao]]).
      expect(useRelatorioForm.mock.calls.length - chamadasAntesDeHidratar).toBe(
        1
      );

      const raizDepoisDeHidratar = dom.window.document.querySelector(
        '[data-testid="painel-filtros-colapsavel"]'
      );
      // NFR-001-002: o atributo que oculta o conteúdo via CSS continua
      // presente logo após a hidratação.
      expect(raizDepoisDeHidratar.getAttribute('data-panel-state')).toBe(
        'recolhido'
      );

      // Clique via `data-testid` (nunca pelo aria-label — preso ao valor do
      // servidor logo após hidratar). Se `isOpen` vier do hook cabeado com a
      // MESMA `{mapKey, itemId}` do painel (cablagem correta), o estado
      // interno já era `false`; o clique inverte para `true` e o atributo
      // sai da raiz. Mutante (isOpen de um `useState(true)` local,
      // dissociado da chave): o estado interno já seria `true`, o clique o
      // inverteria para `false`, e o atributo NUNCA sairia da raiz —
      // reprovando esta asserção.
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
