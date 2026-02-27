import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useContratosList } from './useContratosList';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

function TestComponent({
  contratos,
  dataFormatter,
  handleDeleteContrato,
  readOnly = false,
  isAdmin = false,
}) {
  const { columns, data } = useContratosList({
    contratos,
    dataFormatter,
    handleDeleteContrato,
    readOnly,
    isAdmin,
  });

  return (
    <div>
      <div data-testid="columns">
        {columns.map(col => (
          <span key={col.name}>{col.name};</span>
        ))}
      </div>
      <div data-testid="rows">
        {data.map(row => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span>{row.id}</span>
            <span>{row.dataInicio}</span>
            <span>{row.dataTermino}</span>
            <span>{row.totalAulas}</span>
            <span>{row.totalAulasFeitas}</span>
            <span>{row.totalReposicoes}</span>
            <span>{row.totalFaltas}</span>
            <span>{row.totalAulasCanceladas}</span>
            <div data-testid={`actions-${row.id}`}>{row.acoes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('useContratosList hook', () => {
  it('returns columns with expected names', () => {
    const contratos = [];
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('#;');
    expect(columnsEl).toHaveTextContent('Data início;');
    expect(columnsEl).toHaveTextContent('Data fim;');
    expect(columnsEl).toHaveTextContent('Total de aulas;');
    expect(columnsEl).toHaveTextContent('Aulas;');
    expect(columnsEl).toHaveTextContent('Reposições;');
    expect(columnsEl).toHaveTextContent('Faltas;');
    expect(columnsEl).toHaveTextContent('Canceladas;');
    expect(columnsEl).toHaveTextContent('Ações;');
  });

  it('formats data using provided formatter', () => {
    const contratos = [
      {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => `formatted:${d}`);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    // Ensure formatter was called with original values
    expect(dataFormatter).toHaveBeenCalledWith('2024-01-01');
    expect(dataFormatter).toHaveBeenCalledWith('2024-12-31');

    // Validate rendered transformed values
    const row = screen.getByTestId('row-1');
    expect(row).toHaveTextContent('1');
    expect(row).toHaveTextContent('formatted:2024-01-01');
    expect(row).toHaveTextContent('formatted:2024-12-31');
    expect(row).toHaveTextContent('100');
    expect(row).toHaveTextContent('50');
    expect(row).toHaveTextContent('5');
    expect(row).toHaveTextContent('3');
    expect(row).toHaveTextContent('2');
  });

  it('renders action buttons with correct links', () => {
    const contratos = [
      {
        id: 123,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const actions = screen.getByTestId('actions-1');

    // Check view link
    const viewLink = actions.querySelector('a[href="/contratos/123"]');
    expect(viewLink).toBeInTheDocument();

    // Check edit link
    const editLink = actions.querySelector('a[href="/contratos/123/editar"]');
    expect(editLink).toBeInTheDocument();

    // Check delete button
    const deleteButton = actions.querySelector('button');
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls handleDeleteContrato when delete button is clicked', () => {
    const contratos = [
      {
        id: 456,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const actions = screen.getByTestId('actions-1');
    const deleteButton = actions.querySelector('button');

    fireEvent.click(deleteButton);

    expect(handleDeleteContrato).toHaveBeenCalledWith(456);
    expect(handleDeleteContrato).toHaveBeenCalledTimes(1);
  });

  it('handles multiple contratos correctly', () => {
    const contratos = [
      {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-06-30',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 1,
      },
      {
        id: 2,
        dataInicio: '2024-07-01',
        dataTermino: '2024-12-31',
        totalAulas: 60,
        totalAulasFeitas: 30,
        totalReposicoes: 3,
        totalFaltas: 2,
        totalAulasCanceladas: 0,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const row1 = screen.getByTestId('row-1');
    const row2 = screen.getByTestId('row-2');

    expect(row1).toHaveTextContent('50');
    expect(row1).toHaveTextContent('25');

    expect(row2).toHaveTextContent('60');
    expect(row2).toHaveTextContent('30');
  });

  it('returns empty data array when contratos is null', () => {
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={null}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const rows = screen.getByTestId('rows');
    expect(rows.children.length).toBe(0);
  });

  it('returns empty data array when contratos is undefined', () => {
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={undefined}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const rows = screen.getByTestId('rows');
    expect(rows.children.length).toBe(0);
  });

  it('returns empty data array when contratos is empty array', () => {
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={[]}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const rows = screen.getByTestId('rows');
    expect(rows.children.length).toBe(0);
  });

  it('removes Ações column when readOnly is true', () => {
    const contratos = [];
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
        readOnly={true}
      />
    );

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('#;');
    expect(columnsEl).toHaveTextContent('Data início;');
    expect(columnsEl).not.toHaveTextContent('Ações;');
  });

  it('keeps Ações column when readOnly is false', () => {
    const contratos = [];
    const dataFormatter = jest.fn();
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
        readOnly={false}
      />
    );

    const columnsEl = screen.getByTestId('columns');
    expect(columnsEl).toHaveTextContent('Ações;');
  });

  it('memoizes data based on contratos, dataFormatter, and handleDeleteContrato', () => {
    const contratos = [
      {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    const { rerender } = render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const initialCallCount = dataFormatter.mock.calls.length;

    // Rerender with same props should not call formatter again
    rerender(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    expect(dataFormatter.mock.calls.length).toBe(initialCallCount);
  });

  it('generates sequential row IDs starting from 1', () => {
    const contratos = [
      {
        id: 999,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
      {
        id: 888,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    // Row IDs should be 1, 2, etc., not the original contrato IDs
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
    expect(screen.getByTestId('row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('row-999')).not.toBeInTheDocument();
    expect(screen.queryByTestId('row-888')).not.toBeInTheDocument();
  });

  it('handles all numeric fields correctly', () => {
    const contratos = [
      {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 0,
        totalAulasFeitas: 0,
        totalReposicoes: 0,
        totalFaltas: 0,
        totalAulasCanceladas: 0,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const row = screen.getByTestId('row-1');
    // Should display zeros, not empty
    expect(row).toHaveTextContent('0');
  });

  it('renders icons in action buttons', () => {
    const contratos = [
      {
        id: 1,
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      },
    ];

    const dataFormatter = jest.fn(d => d);
    const handleDeleteContrato = jest.fn();

    render(
      <TestComponent
        contratos={contratos}
        dataFormatter={dataFormatter}
        handleDeleteContrato={handleDeleteContrato}
      />
    );

    const actions = screen.getByTestId('actions-1');

    // Check for the presence of lucide-react icon SVGs
    const svgs = actions.querySelectorAll('svg');
    expect(svgs.length).toBe(3); // Eye, Pencil, Trash2
  });
});
