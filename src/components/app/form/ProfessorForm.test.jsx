import { render, screen, fireEvent } from '@testing-library/react';
import { ProfessorForm } from './ProfessorForm';
import { PERMISSAO } from '@/constants';

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
  PasswordField: ({
    htmlFor,
    label,
    value,
    onChange,
    required,
    placeholder,
  }) => (
    <div data-testid={`password-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <input
        type="password"
        id={htmlFor}
        name={htmlFor}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  ),
  SelectField: ({ htmlFor, label, value, onChange, required, options }) => (
    <div data-testid={`select-${htmlFor}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && ' *'}
      </label>
      <select
        id={htmlFor}
        name={htmlFor}
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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

describe('ProfessorForm', () => {
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
      senha: '',
      repetirSenha: '',
      permissao: PERMISSAO.MEMBER,
    },
    message: null,
    isSenhaError: false,
    errors: null,
    isLoading: false,
    isEdit: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<ProfessorForm {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
    expect(screen.getByTestId('input-nome')).toBeInTheDocument();
    expect(screen.getByTestId('input-sobrenome')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-telefone')).toBeInTheDocument();
    expect(screen.getByTestId('password-senha')).toBeInTheDocument();
    expect(screen.getByTestId('password-repetirSenha')).toBeInTheDocument();
    expect(screen.getByTestId('select-permissao')).toBeInTheDocument();
    expect(screen.getByTestId('buttons-fields')).toBeInTheDocument();
  });

  it('renders all required fields with asterisk when not in edit mode', () => {
    render(<ProfessorForm {...defaultProps} />);

    expect(screen.getByText('Nome *')).toBeInTheDocument();
    expect(screen.getByText('Sobrenome *')).toBeInTheDocument();
    expect(screen.getByText('Email *')).toBeInTheDocument();
    expect(screen.getByText('Senha *')).toBeInTheDocument();
    expect(screen.getByText('Repetir Senha *')).toBeInTheDocument();
    expect(screen.getByText('Permissão *')).toBeInTheDocument();
  });

  it('renders password fields as not required in edit mode', () => {
    render(<ProfessorForm {...defaultProps} isEdit={true} />);

    // Nome, Sobrenome, Email e Permissão ainda devem ser obrigatórios
    expect(screen.getByText('Nome *')).toBeInTheDocument();
    expect(screen.getByText('Sobrenome *')).toBeInTheDocument();
    expect(screen.getByText('Email *')).toBeInTheDocument();
    expect(screen.getByText('Permissão *')).toBeInTheDocument();

    // Senhas não devem ser obrigatórias em modo edição
    expect(screen.queryByText('Senha *')).not.toBeInTheDocument();
    expect(screen.queryByText('Repetir Senha *')).not.toBeInTheDocument();
  });

  it('displays FormError with message when message is provided', () => {
    const props = {
      ...defaultProps,
      message: 'Professor cadastrado com sucesso!',
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Professor cadastrado com sucesso!'
    );
  });

  it('displays FormError with senha error when isSenhaError is true', () => {
    const props = {
      ...defaultProps,
      isSenhaError: true,
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'As senhas não coincidem'
    );
  });

  it('displays FormError with errors when errors are provided', () => {
    const mockErrors = { nome: 'Nome é obrigatório', email: 'Email inválido' };
    const props = {
      ...defaultProps,
      errors: mockErrors,
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByTestId('errors')).toHaveTextContent(
      JSON.stringify(mockErrors)
    );
  });

  it('prioritizes message over isSenhaError', () => {
    const props = {
      ...defaultProps,
      message: 'Mensagem prioritária',
      isSenhaError: true,
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByTestId('error-title')).toHaveTextContent(
      'Mensagem prioritária'
    );
  });

  it('calls handleChange when input fields change', () => {
    render(<ProfessorForm {...defaultProps} />);

    const nomeInput = screen.getByPlaceholderText('Digite o nome');
    fireEvent.change(nomeInput, { target: { value: 'João' } });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('calls handleSubmit when form is submitted', () => {
    render(<ProfessorForm {...defaultProps} />);

    const form = screen.getByTestId('form');
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('renders select with correct permission options', () => {
    render(<ProfessorForm {...defaultProps} />);

    const select = screen.getByLabelText(/permissão/i);

    expect(select).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('renders input fields with correct values from formData', () => {
    const props = {
      ...defaultProps,
      formData: {
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
        senha: 'senha123',
        repetirSenha: 'senha123',
        permissao: PERMISSAO.ADMIN,
      },
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByDisplayValue('João')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11999999999')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('senha123')).toHaveLength(2);

    // Verifica se o select tem o valor correto
    const select = screen.getByLabelText(/permissão/i);
    expect(select).toHaveValue(PERMISSAO.ADMIN);
  });

  it('passes isLoading prop to ButtonsFields', () => {
    const props = {
      ...defaultProps,
      isLoading: true,
    };

    render(<ProfessorForm {...props} />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('passes href prop to ButtonsFields', () => {
    render(<ProfessorForm {...defaultProps} />);

    expect(screen.getByText('Cancelar')).toHaveAttribute(
      'href',
      '/professores'
    );
  });

  it('renders all input placeholders correctly', () => {
    render(<ProfessorForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Digite o nome')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Digite o sobrenome')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme a senha')).toBeInTheDocument();
  });

  it('renders FormError component even when no errors', () => {
    render(<ProfessorForm {...defaultProps} />);

    expect(screen.getByTestId('form-error')).toBeInTheDocument();
  });

  it('telefone field is not required', () => {
    render(<ProfessorForm {...defaultProps} />);

    // Telefone não deve ter asterisco
    expect(screen.queryByText('Telefone *')).not.toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
  });
});
