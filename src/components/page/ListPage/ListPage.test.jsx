import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { JSDOM } from 'jsdom';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { ListPage } from './index';

// Mock dependencies. `SearchForm` é mockado (comportamento de outra suíte); os
// demais exports de `@/components/app` — inclusive `PainelFiltrosColapsavel`,
// consumido de verdade por `ListPage` (COMP-002-005) — permanecem reais
// (`jest.requireActual`), para que os testes de AC-001-006/010 e do invariante
// de cablagem exercitem o componente colapsável de verdade, não um duplo.
jest.mock('@/components/app', () => ({
  ...jest.requireActual('@/components/app'),
  SearchForm: ({ placeholder, perform }) => (
    <div data-testid="search-form-mock">
      <input
        data-testid="search-input"
        placeholder={placeholder}
        onChange={e => perform(e.target.value)}
      />
    </div>
  ),
}));

jest.mock('@/components/ui', () => ({
  Table: ({ columns, data, isLoading, notFoundMessage }) => (
    <div data-testid="table-mock">
      {isLoading && <div data-testid="table-loading">Loading...</div>}
      {!isLoading && data.length === 0 && (
        <div data-testid="table-empty">{notFoundMessage}</div>
      )}
      {!isLoading && data.length > 0 && (
        <table>
          <tbody data-testid="table-body">
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
}));

jest.mock('../shared', () => ({
  ButtonsPage: ({ buttons, extraButton }) => (
    <div data-testid="buttons-page-mock">
      {buttons.map((btn, idx) => (
        <button key={idx} data-testid={`button-${btn.type}`}>
          {btn.label}
        </button>
      ))}
      {extraButton}
    </div>
  ),
}));

describe('ListPage', () => {
  const mockColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
  ];

  const mockData = [
    { id: 1, name: 'João Silva', email: 'joao@example.com' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com' },
  ];

  const mockButtons = [
    { href: '/alunos/novo', label: 'Novo Aluno', type: 'primary' },
    { href: '/alunos', label: 'Voltar', type: 'secondary' },
  ];

  const mockSearch = {
    title: 'Buscar aluno',
    searchParams: jest.fn(),
  };

  // `ListPage` chama `useCollapsiblePanelState(filterStorageKey)` incondicionalmente
  // (com `filterStorageKey=null` para as telas sem painel) — isola cada teste da
  // preferência persistida por qualquer teste anterior.
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render with data-testid on title', () => {
    render(
      <ListPage
        title="Alunos"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum aluno encontrado"
      />
    );

    const title = screen.getByTestId('list-page-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Alunos');
  });

  it('should render controls section with data-testid', () => {
    render(
      <ListPage
        title="Professores"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum professor encontrado"
      />
    );

    expect(screen.getByTestId('list-page-controls')).toBeInTheDocument();
  });

  it('should render table section with data-testid', () => {
    render(
      <ListPage
        title="Contratos"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Nenhum contrato encontrado"
      />
    );

    expect(screen.getByTestId('list-page-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-mock')).toBeInTheDocument();
  });

  it('should render ButtonsPage component', () => {
    render(
      <ListPage
        title="List Page"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('buttons-page-mock')).toBeInTheDocument();
  });

  it('should render SearchForm when search prop is provided', () => {
    render(
      <ListPage
        title="Search List"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('search-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toHaveAttribute(
      'placeholder',
      'Buscar aluno'
    );
  });

  it('should not render SearchForm when search prop is null', () => {
    render(
      <ListPage
        title="No Search List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.queryByTestId('search-form-mock')).not.toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(
      <ListPage
        title="List with Data"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const tableBody = screen.getByTestId('table-body');
    expect(tableBody).toBeInTheDocument();
    expect(tableBody.querySelectorAll('tr')).toHaveLength(2);
  });

  it('should display loading state', () => {
    render(
      <ListPage
        title="Loading List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={[]}
        isLoading={true}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('table-loading')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent('Loading...');
  });

  it('should display empty state when no data', () => {
    render(
      <ListPage
        title="Empty List"
        buttons={mockButtons}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={[]}
        isLoading={false}
        notFoundMessage="Nenhum item encontrado"
      />
    );

    expect(screen.getByTestId('table-empty')).toBeInTheDocument();
    expect(screen.getByTestId('table-empty')).toHaveTextContent(
      'Nenhum item encontrado'
    );
  });

  it('should pass search parameters to SearchForm', () => {
    const mockSearchFn = jest.fn();
    const customSearch = {
      title: 'Search profesores',
      searchParams: mockSearchFn,
    };

    render(
      <ListPage
        title="Professor List"
        buttons={mockButtons}
        extraButton={null}
        search={customSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockSearchFn).toHaveBeenCalledWith('test');
  });

  it('should render with empty buttons array', () => {
    render(
      <ListPage
        title="List with Empty Buttons"
        buttons={[]}
        extraButton={null}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('list-page-title')).toBeInTheDocument();
    expect(screen.getByTestId('list-page-table')).toBeInTheDocument();
  });

  it('should render with extraButton', () => {
    const extraButton = <button data-testid="extra-btn">Extra Action</button>;

    render(
      <ListPage
        title="List with Extra Button"
        buttons={mockButtons}
        extraButton={extraButton}
        search={null}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    expect(screen.getByTestId('extra-btn')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    const { container } = render(
      <ListPage
        title="Styled List"
        buttons={mockButtons}
        extraButton={null}
        search={mockSearch}
        columns={mockColumns}
        data={mockData}
        isLoading={false}
        notFoundMessage="Not found"
      />
    );

    const controlsDiv = container.querySelector(
      '[data-testid="list-page-controls"]'
    );
    expect(controlsDiv).toHaveClass('lg:grid', 'lg:grid-cols-2', 'gap-4');
  });

  describe('AC-001-010 (não-regressão, FR-001-014): shape observável sem filterStorageKey/Filter', () => {
    it('caso Filter=null: árvore contém só title/controls/table — snapshot é a baseline anti-regressão', () => {
      const { asFragment } = render(
        <ListPage
          title="Alunos"
          buttons={mockButtons}
          extraButton={null}
          search={mockSearch}
          columns={mockColumns}
          data={mockData}
          isLoading={false}
          notFoundMessage="Nenhum aluno encontrado"
        />
      );

      // Guarda anti-regressão do caso Filter=null: o wrapper do painel só existe
      // dentro do `{Filter && (...)}`. Mutante: mover esse wrapper para fora da
      // condicional (renderizá-lo incondicionalmente) faz este snapshot divergir.
      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByTestId('list-page-title')).toBeInTheDocument();
      expect(screen.getByTestId('list-page-controls')).toBeInTheDocument();
      expect(screen.getByTestId('list-page-table')).toBeInTheDocument();
      expect(screen.queryByTestId('list-page-filter')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('painel-filtros-colapsavel')
      ).not.toBeInTheDocument();

      const botoesComAriaExpanded = screen
        .queryAllByRole('button')
        .filter(botao => botao.hasAttribute('aria-expanded'));
      expect(botoesComAriaExpanded).toHaveLength(0);
    });
  });

  describe('AC-001-006 (FR-001-007): SearchForm permanece visível e utilizável com o painel recolhido', () => {
    const FiltroDeTeste = () => (
      <div data-testid="filtro-de-teste">campos do filtro</div>
    );

    it('preferência persistida "recolhido": SearchForm continua presente e o input aceita digitação', () => {
      localStorage.setItem(
        'panel_teste_listpage_ac006',
        JSON.stringify('recolhido')
      );

      render(
        <ListPage
          title="Aulas"
          buttons={mockButtons}
          extraButton={null}
          search={mockSearch}
          columns={mockColumns}
          data={mockData}
          isLoading={false}
          notFoundMessage="Nenhuma aula encontrada"
          Filter={FiltroDeTeste}
          filterParams={{}}
          filterStorageKey="panel_teste_listpage_ac006"
        />
      );

      // pré-condição: o painel está de fato recolhido nesta renderização.
      expect(screen.getByTestId('painel-filtros-colapsavel')).toHaveAttribute(
        'data-panel-state',
        'recolhido'
      );

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).not.toBeDisabled();

      fireEvent.change(searchInput, { target: { value: 'busca' } });
      expect(mockSearch.searchParams).toHaveBeenCalledWith('busca');
    });

    it('alternar o painel via clique no controle: SearchForm permanece presente antes e depois', async () => {
      const user = userEvent.setup();

      render(
        <ListPage
          title="Aulas"
          buttons={mockButtons}
          extraButton={null}
          search={mockSearch}
          columns={mockColumns}
          data={mockData}
          isLoading={false}
          notFoundMessage="Nenhuma aula encontrada"
          Filter={FiltroDeTeste}
          filterParams={{}}
          filterStorageKey="panel_teste_listpage_ac006_toggle"
        />
      );

      expect(screen.getByTestId('search-form-mock')).toBeInTheDocument();

      const botaoRecolher = screen.getByRole('button', {
        name: /recolher filtros/i,
      });
      await user.click(botaoRecolher);

      expect(
        screen.getByRole('button', { name: /expandir filtros/i })
      ).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByTestId('search-form-mock')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).not.toBeDisabled();
    });
  });

  describe('INVARIANTE DE CABLAGEM (herdado do re-review da wave 2, DEC-002-001 §6): isOpen vem de useCollapsiblePanelState(a MESMA storageKey do painel)', () => {
    const FiltroDeTeste = () => <div data-testid="filtro-de-teste">x</div>;
    const CHAVE = 'panel_teste_invariante_cablagem';

    function montarMarkupDeServidor() {
      // Simula o servidor (A-001-001: sempre aberto lá, por não haver
      // localStorage nenhum): limpa o localStorage do próprio ambiente Jest
      // — é ele que o código de produção lê via `window`/`localStorage`
      // ambientes, inclusive durante hidratação (ver abaixo) — antes de gerar
      // o markup estático.
      localStorage.clear();
      return renderToString(
        <ListPage
          title="Aulas"
          buttons={[]}
          extraButton={null}
          search={null}
          columns={[]}
          data={[]}
          isLoading={false}
          notFoundMessage="x"
          Filter={FiltroDeTeste}
          filterParams={{}}
          filterStorageKey={CHAVE}
        />
      );
    }

    it('preferência salva "recolhido": o atributo aplicado pelo script anti-flash sobrevive à hidratação (isOpen inicial vem do hook, não diverge) e some ao expandir', () => {
      const markup = montarMarkupDeServidor();
      const html = `<!DOCTYPE html><html><body><div id="root">${markup}</div></body></html>`;

      // Ambiente jsdom AMBIENTE (o próprio realm do Jest): é dele que o código
      // de produção (useCollapsiblePanelState -> filterStorage.js) lê
      // `localStorage` durante a hidratação abaixo — precisa ter a MESMA
      // preferência que o script inline (que roda no realm do documento
      // isolado, criado a seguir) vai encontrar.
      localStorage.setItem(CHAVE, JSON.stringify('recolhido'));

      // Documento isolado, com o parser REAL (lição
      // [[prova-de-script-inline-precisa-do-parser-real]]): o script
      // anti-flash embutido no markup executa durante o parse, antes de
      // qualquer hidratação, e sua própria leitura de localStorage é a deste
      // realm isolado — semeada aqui via `beforeParse`.
      const dom = new JSDOM(html, {
        runScripts: 'dangerously',
        url: 'https://invariante-cablagem.teste/',
        beforeParse(janela) {
          janela.localStorage.setItem(CHAVE, JSON.stringify('recolhido'));
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

      // Hidrata a árvore real. `renderToString`/`hydrateRoot` **não** corrige
      // atributos divergentes entre o markup do servidor e o valor computado
      // no cliente durante a própria hidratação (comportamento do React,
      // medido: o atributo aplicado pelo script permanece intacto na primeira
      // passada, coincida ou não com o `isOpen` real) — por isso a asserção
      // que de fato discrimina cablagem correta de incorreta não é o estado
      // logo após hidratar, e sim a interação **seguinte**: só uma
      // reconciliação normal (fora da hidratação, disparada por um evento)
      // aplica o atributo a partir do estado React corrente.
      let root;
      expect(() => {
        act(() => {
          root = hydrateRoot(
            container,
            <ListPage
              title="Aulas"
              buttons={[]}
              extraButton={null}
              search={null}
              columns={[]}
              data={[]}
              isLoading={false}
              notFoundMessage="x"
              Filter={FiltroDeTeste}
              filterParams={{}}
              filterStorageKey={CHAVE}
            />
          );
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
      // rótulo em si pode estar "preso" no valor do servidor logo após
      // hidratar, pela mesma razão do comentário acima). O clique dispara o
      // `toggle()` REAL do hook: se `isOpen` veio de
      // `useCollapsiblePanelState(CHAVE)` (cablagem correta), o estado
      // interno já era `false`, e o clique o inverte para `true` — a
      // reconciliação normal que segue (fora da hidratação) remove o
      // atributo da raiz. Mutante (isOpen de um `useState(true)` local,
      // dissociado da chave): o estado interno já seria `true`, e o clique o
      // inverteria para `false` — a reconciliação normal aplicaria
      // `data-panel-state="recolhido"` de novo, e o atributo NUNCA sairia da
      // raiz, reprovando esta asserção.
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
