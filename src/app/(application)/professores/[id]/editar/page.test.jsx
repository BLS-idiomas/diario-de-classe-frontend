import { render, screen, waitFor } from '@testing-library/react';
import { notFound } from 'next/navigation';
import EditarProfessor from './page';
import { STATUS_ERROR } from '@/constants/statusError';

// Mock dos hooks
jest.mock('@/hooks/professores/useEditarProfessor');
jest.mock('@/hooks/professores/useProfessorForm');

// Mock do Next.js
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useParams: jest.fn(),
}));

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
  PageContent: ({ children }) => (
    <div data-testid="page-content">{children}</div>
  ),
  PageSubTitle: ({ children }) => (
    <h2 data-testid="page-subtitle">{children}</h2>
  ),
  PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
  Loading: () => <div data-testid="loading">Carregando...</div>,
  ProfessorForm: ({
    handleSubmit,
    handleChange,
    formData,
    isSenhaError,
    isLoading,
    message,
    errors,
    isEdit,
  }) => (
    <form data-testid="professor-form" onSubmit={handleSubmit}>
      <div data-testid="form-data">{JSON.stringify(formData)}</div>
      {isSenhaError && <div data-testid="senha-error">Erro na senha</div>}
      {isLoading && <div data-testid="form-loading">Enviando...</div>}
      {message && <div data-testid="message">{message}</div>}
      {errors && <div data-testid="errors">{JSON.stringify(errors)}</div>}
      {isEdit && <div data-testid="is-edit">Modo Edição</div>}
      <button type="submit">Salvar</button>
    </form>
  ),
}));

describe('EditarProfessor Page', () => {
  const mockSubmit = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockSetFormData = jest.fn();

  const mockParams = { id: '123' };

  const mockCurrent = {
    id: '123',
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    permissao: 'admin',
  };

  const mockFormData = {
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    permissao: 'admin',
    senha: '',
    repetirSenha: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const { useParams } = require('next/navigation');
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');

    useParams.mockReturnValue(mockParams);

    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      current: mockCurrent,
      statusError: null,
      submit: mockSubmit,
    });

    useProfessorForm.mockReturnValue({
      formData: mockFormData,
      isSenhaError: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData,
    });
  });

  it('renders the page with all main components', () => {
    render(<EditarProfessor />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('page-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('button-group')).toBeInTheDocument();
    expect(screen.getByTestId('professor-form')).toBeInTheDocument();
  });

  it('renders the page title correctly', () => {
    render(<EditarProfessor />);

    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'Editar Professor'
    );
  });

  it('renders the page subtitle correctly', () => {
    render(<EditarProfessor />);

    expect(screen.getByTestId('page-subtitle')).toHaveTextContent(
      'Atualize os dados do professor'
    );
  });

  it('renders the "Voltar" button with correct link', () => {
    render(<EditarProfessor />);

    const link = screen.getByRole('link', { name: /voltar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/professores/${mockParams.id}`);
  });

  it('passes isEdit prop to ProfessorForm', () => {
    render(<EditarProfessor />);

    expect(screen.getByTestId('is-edit')).toHaveTextContent('Modo Edição');
  });

  it('shows Loading component when isLoading is true and current is null', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: true,
      current: null,
      statusError: null,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Carregando...');
    expect(screen.queryByTestId('professor-form')).not.toBeInTheDocument();
  });

  it('does not show Loading when isLoading is true but current exists', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: true,
      current: mockCurrent,
      statusError: null,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('professor-form')).toBeInTheDocument();
  });

  it('calls setFormData when current data is loaded', () => {
    render(<EditarProfessor />);

    waitFor(() => {
      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockCurrent,
        senha: '',
        repetirSenha: '',
      });
    });
  });

  it('calls notFound when statusError is BAD_REQUEST', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      current: null,
      statusError: STATUS_ERROR.BAD_REQUEST,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it('calls notFound when statusError is NOT_FOUND', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      current: null,
      statusError: STATUS_ERROR.NOT_FOUND,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });

  it('does not call notFound when statusError is null', () => {
    render(<EditarProfessor />);

    expect(notFound).not.toHaveBeenCalled();
  });

  it('shows message when message is provided', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: 'Professor atualizado com sucesso!',
      errors: null,
      isLoading: false,
      current: mockCurrent,
      statusError: null,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    expect(screen.getByTestId('message')).toHaveTextContent(
      'Professor atualizado com sucesso!'
    );
  });

  it('shows errors when errors are provided', () => {
    const mockErrors = { nome: 'Nome é obrigatório', email: 'Email inválido' };
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');
    useEditarProfessor.mockReturnValue({
      message: null,
      errors: mockErrors,
      isLoading: false,
      current: mockCurrent,
      statusError: null,
      submit: mockSubmit,
    });

    render(<EditarProfessor />);

    const errorsElement = screen.getByTestId('errors');
    expect(errorsElement).toHaveTextContent(JSON.stringify(mockErrors));
  });

  it('calls useEditarProfessor with params.id', () => {
    const {
      useEditarProfessor,
    } = require('@/hooks/professores/useEditarProfessor');

    render(<EditarProfessor />);

    expect(useEditarProfessor).toHaveBeenCalledWith(mockParams.id);
  });

  it('calls useProfessorForm with correct parameters', () => {
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');

    render(<EditarProfessor />);

    expect(useProfessorForm).toHaveBeenCalledWith({
      submit: mockSubmit,
      isEdit: true,
      id: mockParams.id,
    });
  });

  it('shows senha error when isSenhaError is true', () => {
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');
    useProfessorForm.mockReturnValue({
      formData: mockFormData,
      isSenhaError: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData,
    });

    render(<EditarProfessor />);

    expect(screen.getByTestId('senha-error')).toHaveTextContent(
      'Erro na senha'
    );
  });

  it('passes correct props to ProfessorForm', () => {
    render(<EditarProfessor />);

    const form = screen.getByTestId('professor-form');
    expect(form).toBeInTheDocument();

    // Verifica se formData está sendo passado
    const formDataElement = screen.getByTestId('form-data');
    expect(formDataElement).toHaveTextContent(JSON.stringify(mockFormData));
  });
});
