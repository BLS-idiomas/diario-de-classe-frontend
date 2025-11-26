import React from 'react';
import { render } from '@testing-library/react';
import { Table } from './index';

// Mock do react-data-table-component para tornar o componente testável
jest.mock('react-data-table-component', () => {
  return function MockDataTable(props) {
    const {
      columns = [],
      data = [],
      progressPending,
      progressComponent,
      noDataComponent,
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
});
