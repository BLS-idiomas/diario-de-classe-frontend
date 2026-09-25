import React from 'react';
import { render } from '@testing-library/react';
import { Table } from './index';
import { ThemeProvider } from '@/providers/ThemeProvider';

// Mock do react-data-table-component para tornar o componente testável
jest.mock('react-data-table-component', () => {
  return function MockDataTable(props) {
    const {
      columns = [],
      data = [],
      progressPending,
      progressComponent,
      noDataComponent,
      customStyles = {},
    } = props;
    return (
      <div>
        <div data-testid="progress" data-visible={progressPending}>
          {progressPending ? 'progress' : 'no-progress'}
        </div>
        <div data-testid="columns">{columns.map(c => c.name).join('|')}</div>
        <div data-testid="rows">
          {data.map(r => r.nome || r.name || r.id).join('|')}
        </div>
        <div data-testid="no-data">
          {data.length === 0 ? noDataComponent : null}
        </div>
        <div data-testid="progress-component">
          {progressPending ? progressComponent : null}
        </div>
        <div data-testid="no-data-component">
          {data.length === 0 ? noDataComponent : null}
        </div>
        {/* Exposição do customStyles recebido pela lib — só assim o teste
            consegue provar o que é passado como prop, já que
            react-data-table-component não repassa customStyles para o DOM. */}
        <div data-testid="custom-styles">
          {JSON.stringify({
            progress: customStyles.progress ?? null,
            noData: customStyles.noData ?? null,
            pagination: customStyles.pagination ?? null,
            headCells: customStyles.headCells ?? null,
            rows: customStyles.rows ?? null,
          })}
        </div>
      </div>
    );
  };
});

describe('Table component', () => {
  it('renders columns and rows', () => {
    const columns = [
      { name: 'Nome', selector: 'nome' },
      { name: 'Telefone', selector: 'telefone' },
    ];
    const data = [
      { id: 1, nome: 'João' },
      { id: 2, nome: 'Maria' },
    ];

    const { getByTestId } = render(
      <Table
        columns={columns}
        data={data}
        isLoading={false}
        notFoundMessage="Nenhum"
      />
    );

    expect(getByTestId('columns').textContent).toContain('Nome');
    expect(getByTestId('rows').textContent).toContain('João');
  });

  it('shows loading when isLoading is true', () => {
    const columns = [{ name: 'Col' }];
    const data = [];
    const { getByTestId } = render(
      <Table
        columns={columns}
        data={data}
        isLoading={true}
        notFoundMessage="Nada"
      />
    );

    expect(getByTestId('progress').getAttribute('data-visible')).toBe('true');
    expect(getByTestId('progress-component').textContent).toContain(
      'Carregando'
    );
  });

  it('shows noDataComponent when data empty', () => {
    const columns = [{ name: 'Col' }];
    const data = [];
    const { getByTestId } = render(
      <Table
        columns={columns}
        data={data}
        isLoading={false}
        notFoundMessage="Nada"
      />
    );

    expect(getByTestId('no-data').textContent).toContain('Nada');
  });

  // DEC-002-001: scroll horizontal contido ao próprio container, nunca à página.
  it('contém o scroll ao container (overflow-x-auto max-w-full) sem className customizado', () => {
    const { getByTestId } = render(
      <Table columns={[]} data={[]} isLoading={false} notFoundMessage="Nada" />
    );

    const wrapperClassName = getByTestId('table').className;
    expect(wrapperClassName).toContain('overflow-x-auto');
    expect(wrapperClassName).toContain('max-w-full');
    expect(wrapperClassName).toContain('bg-main');
    expect(wrapperClassName).toContain('p-2');
    expect(wrapperClassName).toContain('rounded-lg');
    expect(wrapperClassName).toContain('shadow-md');
  });
});

// BI-41: sem customStyles em progress/noData no tema dark, esses containers
// caem no fundo branco padrão da lib nos estados de carregando/vazio.
describe('Table component - customStyles do tema dark (BI-41)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithTheme = theme => {
    localStorage.setItem('theme', theme);
    const columns = [{ name: 'Col' }];
    return render(
      <ThemeProvider>
        <Table columns={columns} data={[]} isLoading notFoundMessage="Nada" />
      </ThemeProvider>
    );
  };

  it('aplica fundo escuro em progress e noData no tema dark (estados de carregando/vazio)', () => {
    const { getByTestId } = renderWithTheme('dark');

    const customStyles = JSON.parse(getByTestId('custom-styles').textContent);

    expect(customStyles.progress).toEqual({
      style: {
        backgroundColor: '#1f2937',
        color: 'var(--color-gray-300)',
      },
    });
    expect(customStyles.noData).toEqual({
      style: {
        backgroundColor: '#1f2937',
        color: 'var(--color-gray-300)',
      },
    });
  });

  it('não customiza progress/noData no tema claro', () => {
    const { getByTestId } = renderWithTheme('light');

    const customStyles = JSON.parse(getByTestId('custom-styles').textContent);

    expect(customStyles.progress).toBeNull();
    expect(customStyles.noData).toBeNull();
  });

  it('define backgroundColor de hover da linha no tema escuro (antes só existia num CSS morto, .dark, que o app nunca aplica — usa data-theme)', () => {
    const { getByTestId } = renderWithTheme('dark');

    const customStyles = JSON.parse(getByTestId('custom-styles').textContent);

    expect(customStyles.rows.highlightOnHoverStyle.backgroundColor).toBe(
      '#334155'
    );
  });
});

// AC-001-009: paginação e cabeçalho de ordenação precisam de área de toque
// mínima de 44px (2.75rem, via var(--tap-target-size)) nos dois ramos de
// tema. Os botões reais de paginação (#pagination-first-page, previous,
// next, last-page) só respeitam `pagination.pageButtonsStyle` — a lib NÃO
// aplica `pagination.style` a eles, só ao <nav> container.
describe('Table component - área de toque da paginação e ordenação (AC-001-009)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithTheme = theme => {
    localStorage.setItem('theme', theme);
    const columns = [{ name: 'Col' }];
    return render(
      <ThemeProvider>
        <Table
          columns={columns}
          data={[]}
          isLoading={false}
          notFoundMessage="Nada"
        />
      </ThemeProvider>
    );
  };

  it('aplica área de toque aos botões de paginação e ao cabeçalho de ordenação no tema claro', () => {
    const { getByTestId } = renderWithTheme('light');

    const customStyles = JSON.parse(getByTestId('custom-styles').textContent);

    expect(customStyles.pagination.pageButtonsStyle.height).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.pagination.pageButtonsStyle.width).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.headCells.style.minHeight).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.headCells.style.minWidth).toBe(
      'var(--tap-target-size)'
    );
  });

  it('aplica área de toque aos botões de paginação e ao cabeçalho de ordenação no tema escuro', () => {
    const { getByTestId } = renderWithTheme('dark');

    const customStyles = JSON.parse(getByTestId('custom-styles').textContent);

    expect(customStyles.pagination.pageButtonsStyle.height).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.pagination.pageButtonsStyle.width).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.headCells.style.minHeight).toBe(
      'var(--tap-target-size)'
    );
    expect(customStyles.headCells.style.minWidth).toBe(
      'var(--tap-target-size)'
    );
  });

  it('não encolhe o container de paginação abaixo do default da lib (56px) em nenhum tema', () => {
    const light = renderWithTheme('light');
    const lightStyles = JSON.parse(
      light.getByTestId('custom-styles').textContent
    );
    expect(lightStyles.pagination.style?.minHeight).toBeUndefined();
    expect(lightStyles.pagination.style?.minWidth).toBeUndefined();
    light.unmount();

    const dark = renderWithTheme('dark');
    const darkStyles = JSON.parse(
      dark.getByTestId('custom-styles').textContent
    );
    expect(darkStyles.pagination.style?.minHeight).toBeUndefined();
    expect(darkStyles.pagination.style?.minWidth).toBeUndefined();
  });
});
