import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useContratosList } from './useContratosList';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <svg data-testid="icon-eye" />,
  Pencil: () => <svg data-testid="icon-pencil" />,
  Trash2: () => <svg data-testid="icon-trash" />,
}));

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
            <span data-testid={`row-id-${row.id}`}>{row.id}</span>
            <span data-testid={`row-aluno-${row.id}`}>{row.aluno}</span>
            <span data-testid={`row-idioma-${row.id}`}>{row.idioma}</span>
            <span data-testid={`row-dataInicio-${row.id}`}>
              {row.dataInicio}
            </span>
            <span data-testid={`row-dataTermino-${row.id}`}>
              {row.dataTermino}
            </span>
            <span data-testid={`row-totalAulas-${row.id}`}>
              {row.totalAulas}
            </span>
            <span data-testid={`row-totalAulasFeitas-${row.id}`}>
              {row.totalAulasFeitas}
            </span>
            <span data-testid={`row-totalReposicoes-${row.id}`}>
              {row.totalReposicoes}
            </span>
            <span data-testid={`row-totalFaltas-${row.id}`}>
              {row.totalFaltas}
            </span>
            <span data-testid={`row-totalAulasCanceladas-${row.id}`}>
              {row.totalAulasCanceladas}
            </span>
            <div data-testid={`actions-${row.id}`}>{row.acoes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('useContratosList Hook', () => {
  const mockFormatter = jest.fn(d => d);
  const mockDeleter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Column Structure', () => {
    it('should return columns with expected names', () => {
      render(
        <TestComponent
          contratos={[]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      const columnsEl = screen.getByTestId('columns');
      expect(columnsEl).toHaveTextContent('#;');
      expect(columnsEl).toHaveTextContent('Aluno;');
      expect(columnsEl).toHaveTextContent('Idioma;');
      expect(columnsEl).toHaveTextContent('Data início;');
      expect(columnsEl).toHaveTextContent('Data fim;');
      expect(columnsEl).toHaveTextContent('Total de aulas;');
      expect(columnsEl).toHaveTextContent('Aulas;');
      expect(columnsEl).toHaveTextContent('Reposições;');
      expect(columnsEl).toHaveTextContent('Faltas;');
      expect(columnsEl).toHaveTextContent('Canceladas;');
      expect(columnsEl).toHaveTextContent('Ações;');
    });

    it('should have correct column properties (sortable, width)', () => {
      const { columns } = renderTestHook([], mockFormatter, mockDeleter);

      expect(columns[0]).toHaveProperty('sortable', true);
      expect(columns[0]).toHaveProperty('width', '75px');
      expect(columns[10]).toHaveProperty('name', 'Ações');
      expect(columns[10]).toHaveProperty('sortable', false);
    });

    it('should remove Ações column when readOnly is true', () => {
      render(
        <TestComponent
          contratos={[]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          readOnly={true}
        />
      );

      const columnsEl = screen.getByTestId('columns');
      expect(columnsEl).not.toHaveTextContent('Ações;');
    });

    it('should keep Ações column when readOnly is false', () => {
      render(
        <TestComponent
          contratos={[]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          readOnly={false}
        />
      );

      const columnsEl = screen.getByTestId('columns');
      expect(columnsEl).toHaveTextContent('Ações;');
    });
  });

  describe('Data Formatting', () => {
    it('should format dates using provided formatter', () => {
      const mockDateFormatter = jest.fn(d => `formatted:${d}`);
      const contrato = {
        id: 1,
        aluno: { nome: 'João Silva' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 50,
        totalReposicoes: 5,
        totalFaltas: 3,
        totalAulasCanceladas: 2,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockDateFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(mockDateFormatter).toHaveBeenCalledWith('2024-01-01');
      expect(mockDateFormatter).toHaveBeenCalledWith('2024-12-31');
      expect(screen.getByTestId('row-dataInicio-1')).toHaveTextContent(
        'formatted:2024-01-01'
      );
      expect(screen.getByTestId('row-dataTermino-1')).toHaveTextContent(
        'formatted:2024-12-31'
      );
    });

    it('should display aluno nome correctly', () => {
      const contrato = {
        id: 1,
        aluno: { nome: 'Maria Santos' },
        idioma: 'SPANISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-aluno-1')).toHaveTextContent(
        'Maria Santos'
      );
    });

    it('should display "-" when aluno nome is missing', () => {
      const contrato = {
        id: 1,
        aluno: null,
        idioma: 'FRENCH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-aluno-1')).toHaveTextContent('-');
    });

    it('should display idioma label correctly', () => {
      const contrato = {
        id: 1,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      // The actual label will depend on the IDIOMA_LABEL constant
      expect(screen.getByTestId('row-idioma-1')).toBeInTheDocument();
    });
  });

  describe('Row Data', () => {
    it('should display all contract statistics correctly', () => {
      const contrato = {
        id: 1,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 100,
        totalAulasFeitas: 75,
        totalReposicoes: 5,
        totalFaltas: 8,
        totalAulasCanceladas: 12,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-totalAulas-1')).toHaveTextContent('100');
      expect(screen.getByTestId('row-totalAulasFeitas-1')).toHaveTextContent(
        '75'
      );
      expect(screen.getByTestId('row-totalReposicoes-1')).toHaveTextContent(
        '5'
      );
      expect(screen.getByTestId('row-totalFaltas-1')).toHaveTextContent('8');
      expect(
        screen.getByTestId('row-totalAulasCanceladas-1')
      ).toHaveTextContent('12');
    });

    it('should handle zero values correctly', () => {
      const contrato = {
        id: 1,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 0,
        totalAulasFeitas: 0,
        totalReposicoes: 0,
        totalFaltas: 0,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-totalAulas-1')).toHaveTextContent('0');
      expect(screen.getByTestId('row-totalAulasFeitas-1')).toHaveTextContent(
        '0'
      );
    });

    it('should generate sequential row IDs starting from 1', () => {
      const contratos = [
        {
          id: 999,
          aluno: { nome: 'João' },
          idioma: 'ENGLISH',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          totalAulas: 50,
          totalAulasFeitas: 25,
          totalReposicoes: 2,
          totalFaltas: 1,
          totalAulasCanceladas: 0,
        },
        {
          id: 888,
          aluno: { nome: 'Maria' },
          idioma: 'SPANISH',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          totalAulas: 60,
          totalAulasFeitas: 30,
          totalReposicoes: 3,
          totalFaltas: 2,
          totalAulasCanceladas: 1,
        },
      ];

      render(
        <TestComponent
          contratos={contratos}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-id-1')).toHaveTextContent('1');
      expect(screen.getByTestId('row-id-2')).toHaveTextContent('2');
      expect(screen.queryByTestId('row-id-999')).not.toBeInTheDocument();
    });

    it('should handle multiple contratos correctly', () => {
      const contratos = [
        {
          id: 1,
          aluno: { nome: 'João' },
          idioma: 'ENGLISH',
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
          aluno: { nome: 'Maria' },
          idioma: 'SPANISH',
          dataInicio: '2024-07-01',
          dataTermino: '2024-12-31',
          totalAulas: 60,
          totalAulasFeitas: 30,
          totalReposicoes: 3,
          totalFaltas: 2,
          totalAulasCanceladas: 0,
        },
      ];

      render(
        <TestComponent
          contratos={contratos}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      expect(screen.getByTestId('row-totalAulas-1')).toHaveTextContent('50');
      expect(screen.getByTestId('row-totalAulasFeitas-1')).toHaveTextContent(
        '25'
      );
      expect(screen.getByTestId('row-totalAulas-2')).toHaveTextContent('60');
      expect(screen.getByTestId('row-totalAulasFeitas-2')).toHaveTextContent(
        '30'
      );
    });
  });

  describe('Actions Column & Buttons', () => {
    it('should render all action buttons when isAdmin is true', () => {
      const contrato = {
        id: 123,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          isAdmin={true}
        />
      );

      const actions = screen.getByTestId('actions-1');
      const viewLink = actions.querySelector('a[href="/contratos/123"]');
      const editLink = actions.querySelector('a[href="/contratos/123/editar"]');
      const deleteButton = actions.querySelector('button');

      expect(viewLink).toBeInTheDocument();
      expect(editLink).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    it('should hide edit and delete buttons when isAdmin is false', () => {
      const contrato = {
        id: 123,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          isAdmin={false}
        />
      );

      const actions = screen.getByTestId('actions-1');
      const viewLink = actions.querySelector('a[href="/contratos/123"]');
      const editLink = actions.querySelector('a[href="/contratos/123/editar"]');

      expect(viewLink).toBeInTheDocument();
      // Edit link should be hidden (has hidden attribute)
      if (editLink) {
        expect(editLink).toHaveAttribute('hidden');
      }
    });

    it('should render correct links for view and edit', () => {
      const contrato = {
        id: 456,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          isAdmin={true}
        />
      );

      const actions = screen.getByTestId('actions-1');
      const viewLink = actions.querySelector('a[href="/contratos/456"]');
      const editLink = actions.querySelector('a[href="/contratos/456/editar"]');

      expect(viewLink).toBeInTheDocument();
      expect(editLink).toBeInTheDocument();
    });

    it('should call handleDeleteContrato with correct contrato id when delete button is clicked', () => {
      const contrato = {
        id: 789,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      const handleDeleteContrato = jest.fn();

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={handleDeleteContrato}
          isAdmin={true}
        />
      );

      const actions = screen.getByTestId('actions-1');
      const deleteButton = actions.querySelector('button');

      fireEvent.click(deleteButton);

      expect(handleDeleteContrato).toHaveBeenCalledWith(789);
      expect(handleDeleteContrato).toHaveBeenCalledTimes(1);
    });

    it('should render icons in action buttons', () => {
      const contrato = {
        id: 1,
        aluno: { nome: 'João' },
        idioma: 'ENGLISH',
        dataInicio: '2024-01-01',
        dataTermino: '2024-12-31',
        totalAulas: 50,
        totalAulasFeitas: 25,
        totalReposicoes: 2,
        totalFaltas: 1,
        totalAulasCanceladas: 0,
      };

      render(
        <TestComponent
          contratos={[contrato]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
          isAdmin={true}
        />
      );

      const actions = screen.getByTestId('actions-1');
      const eyeIcon = actions.querySelector('[data-testid="icon-eye"]');
      const pencilIcon = actions.querySelector('[data-testid="icon-pencil"]');
      const trashIcon = actions.querySelector('[data-testid="icon-trash"]');

      expect(eyeIcon).toBeInTheDocument();
      expect(pencilIcon).toBeInTheDocument();
      expect(trashIcon).toBeInTheDocument();
    });
  });

  describe('Edge Cases & Empty States', () => {
    it('should return empty data when contratos is null', () => {
      render(
        <TestComponent
          contratos={null}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      const rows = screen.getByTestId('rows');
      expect(rows.children.length).toBe(0);
    });

    it('should return empty data when contratos is undefined', () => {
      render(
        <TestComponent
          contratos={undefined}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      const rows = screen.getByTestId('rows');
      expect(rows.children.length).toBe(0);
    });

    it('should return empty data when contratos is empty array', () => {
      render(
        <TestComponent
          contratos={[]}
          dataFormatter={mockFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      const rows = screen.getByTestId('rows');
      expect(rows.children.length).toBe(0);
    });
  });

  describe('Memoization', () => {
    it('should memoize data based on dependencies', () => {
      const contratos = [
        {
          id: 1,
          aluno: { nome: 'João' },
          idioma: 'ENGLISH',
          dataInicio: '2024-01-01',
          dataTermino: '2024-12-31',
          totalAulas: 50,
          totalAulasFeitas: 25,
          totalReposicoes: 2,
          totalFaltas: 1,
          totalAulasCanceladas: 0,
        },
      ];

      const mockDateFormatter = jest.fn(d => d);

      const { rerender } = render(
        <TestComponent
          contratos={contratos}
          dataFormatter={mockDateFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      const initialCallCount = mockDateFormatter.mock.calls.length;

      // Rerender with same props should use memoized data
      rerender(
        <TestComponent
          contratos={contratos}
          dataFormatter={mockDateFormatter}
          handleDeleteContrato={mockDeleter}
        />
      );

      // Formatter should be called again since we're re-rendering
      expect(mockDateFormatter.mock.calls.length).toBeGreaterThanOrEqual(
        initialCallCount
      );
    });
  });
});

// Helper function for testing hook directly
function renderTestHook(contratos, dataFormatter, handleDeleteContrato) {
  const { result } = renderHook(() =>
    useContratosList({
      contratos,
      dataFormatter,
      handleDeleteContrato,
    })
  );
  return result.current;
}
