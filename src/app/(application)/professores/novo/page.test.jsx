import { render, screen } from '@testing-library/react';
import NovoProfessor from './page';

// Mock dos hooks
jest.mock('@/hooks/professores/useNovoProfessor');
jest.mock('@/hooks/professores/useProfessorForm');

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
  PageContent: ({ children }) => (
    <div data-testid="page-content">{children}</div>
  ),
  PageSubTitle: ({ children }) => (
    <h2 data-testid="page-subtitle">{children}</h2>
  ),
  PageTitle: ({ children }) => <h1 data-testid="page-title">{children}</h1>,
  ProfessorForm: ({
    handleSubmit,
    handleChange,
    formData,
    isSenhaError,
    isSubmitting,
    isLoading,
    message,
    errors,
  }) => (
    <form data-testid="professor-form" onSubmit={handleSubmit}>
      <div data-testid="form-data">{JSON.stringify(formData)}</div>
      {isSenhaError && <div data-testid="senha-error">Erro na senha</div>}
      {isSubmitting && <div data-testid="submitting">Enviando...</div>}
      {isLoading && <div data-testid="loading">Carregando...</div>}
      {message && <div data-testid="message">{message}</div>}
      {errors && <div data-testid="errors">{JSON.stringify(errors)}</div>}
      <button type="submit">Salvar</button>
    </form>
  ),
}));

describe('NovoProfessor Page', () => {
  const mockSubmit = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  const mockFormData = {
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    permissao: 'member',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');

    useNovoProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      isSubmitting: false,
      submit: mockSubmit,
    });

    useProfessorForm.mockReturnValue({
      formData: mockFormData,
      isSenhaError: false,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('renders the page with all main components', () => {
    render(<NovoProfessor />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('page-subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('button-group')).toBeInTheDocument();
    expect(screen.getByTestId('professor-form')).toBeInTheDocument();
  });

  it('renders the page title correctly', () => {
    render(<NovoProfessor />);

    expect(screen.getByTestId('page-title')).toHaveTextContent(
      'Novo Professor'
    );
  });

  it('renders the page subtitle correctly', () => {
    render(<NovoProfessor />);

    expect(screen.getByTestId('page-subtitle')).toHaveTextContent(
      'Preencha os dados para criar um novo professor'
    );
  });

  it('renders the "Voltar" button with correct link', () => {
    render(<NovoProfessor />);

    const link = screen.getByRole('link', { name: /voltar/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/professores');
  });

  it('passes correct props to ProfessorForm', () => {
    render(<NovoProfessor />);

    const form = screen.getByTestId('professor-form');
    expect(form).toBeInTheDocument();

    // Verifica se formData está sendo passado
    const formDataElement = screen.getByTestId('form-data');
    expect(formDataElement).toHaveTextContent(JSON.stringify(mockFormData));
  });

  it('shows loading state when isLoading is true', () => {
    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    useNovoProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: true,
      isSubmitting: false,
      submit: mockSubmit,
    });

    render(<NovoProfessor />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Carregando...');
  });

  it('shows submitting state when isSubmitting is true', () => {
    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    useNovoProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      isSubmitting: true,
      submit: mockSubmit,
    });

    render(<NovoProfessor />);

    expect(screen.getByTestId('submitting')).toHaveTextContent('Enviando...');
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
    });

    render(<NovoProfessor />);

    expect(screen.getByTestId('senha-error')).toHaveTextContent(
      'Erro na senha'
    );
  });

  it('shows message when message is provided', () => {
    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    useNovoProfessor.mockReturnValue({
      message: 'Professor criado com sucesso!',
      errors: null,
      isLoading: false,
      isSubmitting: false,
      submit: mockSubmit,
    });

    render(<NovoProfessor />);

    expect(screen.getByTestId('message')).toHaveTextContent(
      'Professor criado com sucesso!'
    );
  });

  it('shows errors when errors are provided', () => {
    const mockErrors = { nome: 'Nome é obrigatório', email: 'Email inválido' };
    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    useNovoProfessor.mockReturnValue({
      message: null,
      errors: mockErrors,
      isLoading: false,
      isSubmitting: false,
      submit: mockSubmit,
    });

    render(<NovoProfessor />);

    const errorsElement = screen.getByTestId('errors');
    expect(errorsElement).toHaveTextContent(JSON.stringify(mockErrors));
  });

  it('calls useProfessorForm with submit function', () => {
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');

    render(<NovoProfessor />);

    expect(useProfessorForm).toHaveBeenCalledWith({ submit: mockSubmit });
  });

  it('calls all required hooks', () => {
    const {
      useNovoProfessor,
    } = require('@/hooks/professores/useNovoProfessor');
    const {
      useProfessorForm,
    } = require('@/hooks/professores/useProfessorForm');

    render(<NovoProfessor />);

    expect(useNovoProfessor).toHaveBeenCalled();
    expect(useProfessorForm).toHaveBeenCalled();
  });
});
