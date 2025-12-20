import { render, screen, fireEvent } from '@testing-library/react';
import { AlunoForm } from '.';

// Mock dos componentes
jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit }) => (
    <form data-testid="form" onSubmit={handleSubmit}>
      {children}
    </form>
  ),
  FormError: ({ title, errors }) => (
    <div data-testid="form-error">
      {title && <div data-testid="error-title">{title}</div>}
      {errors && <div data-testid="errors">{JSON.stringify(errors)}</div>}
    </div>
  ),
  FormGroup: ({ children }) => <div data-testid="form-group">{children}</div>,
  InputField: ({ htmlFor, label, value, onChange, required, placeholder }) => (
    <div data-testid={`input-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <input
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  ),
  TextAreaField: ({ htmlFor, label, value, onChange, placeholder }) => (
    <div data-testid={`textarea-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <textarea
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  ),
  ButtonsFields: ({ isLoading, href }) => (
    <div data-testid="buttons-fields">
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Salvar'}
      </button>
      <a href={href}>Cancelar</a>
    </div>
  ),
}));

jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: () => ({ isAdmin: jest.fn(() => false) }),
}));

describe('AlunoForm', () => {
  const mockHandleSubmit = jest.fn(e => e.preventDefault());
  const mockHandleChange = jest.fn();

  const defaultProps = {
    handleSubmit: mockHandleSubmit,
    handleChange: mockHandleChange,
    formData: {
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      material: '',
    },
    message: null,
    errors: null,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
    expect(screen.getByTestId('input-nome')).toBeInTheDocument();
    expect(screen.getByTestId('input-sobrenome')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-telefone')).toBeInTheDocument();
    expect(screen.getByTestId('buttons-fields')).toBeInTheDocument();
  });

  it('renders all required fields with asterisk', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.getByText('Nome *')).toBeInTheDocument();
    expect(screen.getByText('Sobrenome *')).toBeInTheDocument();
    expect(screen.getByText('Email *')).toBeInTheDocument();
  });

  it('telefone field is not required', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.queryByText('Telefone *')).not.toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
  });

  it('displays FormError with message when message is provided', () => {
    const props = {
      ...defaultProps,
      message: 'Aluno cadastrado com sucesso!',
    };
    render(<AlunoForm {...props} />);
    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Aluno cadastrado com sucesso!'
    );
  });

  it('displays FormError with errors when errors are provided', () => {
    const mockErrors = { nome: 'Nome é obrigatório', email: 'Email inválido' };
    const props = {
      ...defaultProps,
      errors: mockErrors,
    };
    render(<AlunoForm {...props} />);
    expect(screen.getByTestId('errors')).toHaveTextContent(
      JSON.stringify(mockErrors)
    );
  });

  it('calls handleChange when input fields change', () => {
    render(<AlunoForm {...defaultProps} />);
    const nomeInput = screen.getByPlaceholderText('Digite o nome');
    fireEvent.change(nomeInput, { target: { value: 'Maria' } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleSubmit when form is submitted', () => {
    render(<AlunoForm {...defaultProps} />);
    const form = screen.getByTestId('form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('renders input fields with correct values from formData', () => {
    const props = {
      ...defaultProps,
      formData: {
        nome: 'Maria',
        sobrenome: 'Oliveira',
        email: 'maria@example.com',
        telefone: '11988887777',
        material: 'Livro A',
      },
    };
    render(<AlunoForm {...props} />);
    expect(screen.getByDisplayValue('Maria')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Oliveira')).toBeInTheDocument();
    expect(screen.getByDisplayValue('maria@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11988887777')).toBeInTheDocument();
  });

  it('passes isLoading prop to ButtonsFields', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };
    render(<AlunoForm {...props} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('passes href prop to ButtonsFields', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.getByText('Cancelar')).toHaveAttribute('href', '/aulas');
  });

  it('renders all input placeholders correctly', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite o sobrenome')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeInTheDocument();
  });

  it('renders FormError component even when no errors', () => {
    render(<AlunoForm {...defaultProps} />);
    expect(screen.getByTestId('form-error')).toBeInTheDocument();
  });

  it('renders TextAreaField for material if isAdmin is true', () => {
    jest.resetModules();
    jest.doMock('@/providers/UserAuthProvider', () => ({
      useUserAuth: () => ({ isAdmin: jest.fn(() => true) }),
    }));
    const { AlunoForm: AlunoFormWithAdmin } = require('.');
    render(<AlunoFormWithAdmin {...defaultProps} />);
    expect(screen.getByTestId('textarea-material')).toBeInTheDocument();
    expect(screen.getByLabelText('Material')).toBeInTheDocument();
  });
});
