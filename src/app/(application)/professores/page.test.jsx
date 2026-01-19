import { render, screen } from '@testing-library/react';
import Professores from './page';

// Mock dos hooks
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/professores/useDeletarProfessor');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/professores/useProfessoresList');
jest.mock('@/providers/UserAuthProvider');

// Mock do Link do Next.js
jest.mock('next/link', () => {
  const MockLink = ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock dos componentes
jest.mock('@/components', () => ({
  ButtonGroup: ({ children }) => (
    <div data-testid="button-group">{children}</div>
  ),
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
  Table: ({ columns, data, isLoading, notFoundMessage }) => (
    <div data-testid="table">
      {isLoading && <div data-testid="loading">Carregando...</div>}
      {!isLoading && data.length === 0 && (
        <div data-testid="not-found">{notFoundMessage}</div>
      )}
      {!isLoading && data.length > 0 && (
        <div data-testid="table-content">
          {data.map((row, i) => (
            <div key={i} data-testid={`row-${i}`}>
              {row.name}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

describe('Professores Page', () => {
  const mockCurrentUser = { id: 1, nome: 'Admin' };
  const mockProfessores = [
    {
      id: 1,
      nome: 'João',
      sobrenome: 'Silva',
      email: 'joao@example.com',
      telefone: '11999999999',
      permissao: 'admin',
      dataCriacao: '2024-01-01',
    },
    {
      id: 2,
      nome: 'Maria',
      sobrenome: 'Santos',
      email: 'maria@example.com',
      telefone: '11988888888',
      permissao: 'member',
      dataCriacao: '2024-01-02',
    },
  ];

  const mockColumns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Nome', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
  ];

  const mockData = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@example.com',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
    },
  ];

  const mockHandleDeleteProfessor = jest.fn();
  const mockTelefoneFormatter = jest.fn(
    telefone =>
      `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`
  );
  const mockDataFormatter = jest.fn(data =>
    new Date(data).toLocaleDateString('pt-BR')
  );

  beforeEach(() => {
    jest.clearAllMocks();

    const { useProfessores } = require('@/hooks/professores/useProfessores');
    const {
      useDeletarProfessor,
    } = require('@/hooks/professores/useDeletarProfessor');
    const { useFormater } = require('@/hooks/useFormater');
    const {
      useProfessoresList,
    } = require('@/hooks/professores/useProfessoresList');
    const { useUserAuth } = require('@/providers/UserAuthProvider');

    useUserAuth.mockReturnValue({ currentUser: mockCurrentUser });
    useProfessores.mockReturnValue({
      professores: mockProfessores,
      isLoading: false,
    });
    useDeletarProfessor.mockReturnValue({
      handleDeleteProfessor: mockHandleDeleteProfessor,
    });
    useFormater.mockReturnValue({
      telefoneFormatter: mockTelefoneFormatter,
      dataFormatter: mockDataFormatter,
    });
    useProfessoresList.mockReturnValue({
      columns: mockColumns,
      data: mockData,
    });
  });

  it('renders the page with all main components', () => {
    render(<Professores />);

    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('button-group')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders the page title correctly', () => {
    render(<Professores />);

    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'Lista de Professores'
    );
  });

  it('renders the "Novo Professor" button with correct link', () => {
    render(<Professores />);

    const link = screen.getByRole('link', { name: /novo professor/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/professores/novo');
  });

  it('renders the table with professors data when not loading', () => {
    render(<Professores />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-content')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    const { useProfessores } = require('@/hooks/professores/useProfessores');
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: true,
    });

    render(<Professores />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Carregando...');
    expect(screen.queryByTestId('table-content')).not.toBeInTheDocument();
  });

  it('shows "not found" message when there are no professors', () => {
    const { useProfessores } = require('@/hooks/professores/useProfessores');
    const {
      useProfessoresList,
    } = require('@/hooks/professores/useProfessoresList');

    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
    });
    useProfessoresList.mockReturnValue({
      columns: mockColumns,
      data: [],
    });

    render(<Professores />);

    expect(screen.getByTestId('not-found')).toHaveTextContent(
      'Nenhum professor encontrado.'
    );
    expect(screen.queryByTestId('table-content')).not.toBeInTheDocument();
  });

  it('calls useProfessoresList with correct parameters', () => {
    const {
      useProfessoresList,
    } = require('@/hooks/professores/useProfessoresList');

    render(<Professores />);

    expect(useProfessoresList).toHaveBeenCalledWith({
      currentUser: mockCurrentUser,
      professores: mockProfessores,
      telefoneFormatter: mockTelefoneFormatter,
      dataFormatter: mockDataFormatter,
      handleDeleteProfessor: mockHandleDeleteProfessor,
    });
  });

  it('calls all required hooks', () => {
    const { useProfessores } = require('@/hooks/professores/useProfessores');
    const {
      useDeletarProfessor,
    } = require('@/hooks/professores/useDeletarProfessor');
    const { useFormater } = require('@/hooks/useFormater');
    const {
      useProfessoresList,
    } = require('@/hooks/professores/useProfessoresList');
    const { useUserAuth } = require('@/providers/UserAuthProvider');

    render(<Professores />);

    expect(useUserAuth).toHaveBeenCalled();
    expect(useProfessores).toHaveBeenCalled();
    expect(useDeletarProfessor).toHaveBeenCalled();
    expect(useFormater).toHaveBeenCalled();
    expect(useProfessoresList).toHaveBeenCalled();
  });

  it('passes correct props to Table component', () => {
    render(<Professores />);

    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();
    // O mock verifica se os dados estão sendo renderizados corretamente
    expect(screen.getByTestId('row-0')).toBeInTheDocument();
    expect(screen.getByTestId('row-1')).toBeInTheDocument();
  });
});
