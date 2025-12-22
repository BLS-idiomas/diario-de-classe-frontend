import { render, screen, fireEvent } from '@testing-library/react';
import Login from './page';
import { useLogin } from '@/hooks/auth/useLogin';

// Mocks
jest.mock('@/hooks/auth/useLogin');

jest.mock('@/components', () => ({
  Form: ({ children, handleSubmit, className }) => (
    <form
      onSubmit={handleSubmit}
      className={className}
      data-testid="login-form"
    >
      {children}
    </form>
  ),
  FormGroup: ({ children, cols, className }) => (
    <div data-testid="form-group" data-cols={cols} className={className}>
      {children}
    </div>
  ),
  InputField: ({ htmlFor, label, type, value, onChange, ...props }) => (
    <div data-testid={`input-field-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  ),
  PasswordField: ({ htmlFor, label, value, onChange, ...props }) => (
    <div data-testid={`password-field-${htmlFor}`}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        id={htmlFor}
        type="password"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  ),
}));

describe('Login Page', () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useLogin.mockReturnValue({
      formData: { email: '', senha: '' },
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
    });
  });

  describe('Page Rendering', () => {
    it('renders the welcome title', () => {
      render(<Login />);

      const title = screen.getByText('Bem-vindo!');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        'text-3xl',
        'font-bold',
        'text-gray-800',
        'mb-2'
      );
    });

    it('renders the subtitle with instructions', () => {
      render(<Login />);

      expect(
        screen.getByText('Entre com suas credenciais para acessar o sistema')
      ).toBeInTheDocument();
    });

    it('renders the login form', () => {
      render(<Login />);

      const form = screen.getByTestId('login-form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('w-full');
    });

    it('renders FormGroup with correct props', () => {
      render(<Login />);

      const formGroup = screen.getByTestId('form-group');
      expect(formGroup).toBeInTheDocument();
      expect(formGroup).toHaveAttribute('data-cols', '1');
      expect(formGroup).toHaveClass('mb-6', 'gap-4');
    });
  });

  describe('Form Fields', () => {
    it('renders email input field with correct props', () => {
      render(<Login />);

      const emailField = screen.getByTestId('input-field-email');
      expect(emailField).toBeInTheDocument();

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(emailInput).toHaveAttribute('maxLength', '200');
      expect(emailInput).toHaveAttribute('minLength', '3');
    });

    it('renders password field with correct props', () => {
      render(<Login />);

      const passwordField = screen.getByTestId('password-field-senha');
      expect(passwordField).toBeInTheDocument();

      const passwordInput = screen.getByLabelText('Senha');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('id', 'senha');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
      expect(passwordInput).toHaveAttribute('maxLength', '200');
      expect(passwordInput).toHaveAttribute('minLength', '3');
    });

    it('renders email field with value from formData', () => {
      useLogin.mockReturnValue({
        formData: { email: 'test@example.com', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
      });

      render(<Login />);

      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('renders password field with value from formData', () => {
      useLogin.mockReturnValue({
        formData: { email: '', senha: 'mypassword' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
      });

      render(<Login />);

      const passwordInput = screen.getByLabelText('Senha');
      expect(passwordInput).toHaveValue('mypassword');
    });
  });

  describe('Submit Button', () => {
    it('renders submit button with "Entrar" text when not loading', () => {
      render(<Login />);

      const button = screen.getByRole('button', { name: 'Entrar' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveClass(
        'btn',
        'btn-primary',
        'w-full',
        'text-base',
        'py-3'
      );
    });

    it('renders submit button with "Carregando..." text when loading', () => {
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: true,
      });

      render(<Login />);

      const button = screen.getByRole('button', { name: 'Carregando...' });
      expect(button).toBeInTheDocument();
    });

    it('disables submit button when loading', () => {
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: true,
      });

      render(<Login />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('adds "blocked" class to button when loading', () => {
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: true,
      });

      render(<Login />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('blocked');
    });

    it('does not disable submit button when not loading', () => {
      render(<Login />);

      const button = screen.getByRole('button', { name: 'Entrar' });
      expect(button).not.toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('calls handleChange when email input changes', () => {
      render(<Login />);

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('calls handleChange when password input changes', () => {
      render(<Login />);

      const passwordInput = screen.getByLabelText('Senha');
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      expect(mockHandleChange).toHaveBeenCalled();
    });

    it('calls handleSubmit when form is submitted', () => {
      render(<Login />);

      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe('useLogin Hook Integration', () => {
    it('calls useLogin hook on render', () => {
      render(<Login />);

      expect(useLogin).toHaveBeenCalled();
    });

    it('uses formData from useLogin hook', () => {
      useLogin.mockReturnValue({
        formData: { email: 'hook@test.com', senha: 'hookpass' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
      });

      render(<Login />);

      expect(screen.getByLabelText('Email')).toHaveValue('hook@test.com');
      expect(screen.getByLabelText('Senha')).toHaveValue('hookpass');
    });

    it('uses handleChange from useLogin hook', () => {
      const customHandleChange = jest.fn();
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: customHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
      });

      render(<Login />);

      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

      expect(customHandleChange).toHaveBeenCalled();
    });

    it('uses handleSubmit from useLogin hook', () => {
      const customHandleSubmit = jest.fn();
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: customHandleSubmit,
        isLoading: false,
      });

      render(<Login />);

      const form = screen.getByTestId('login-form');
      fireEvent.submit(form);

      expect(customHandleSubmit).toHaveBeenCalled();
    });

    it('uses isLoading state from useLogin hook', () => {
      useLogin.mockReturnValue({
        formData: { email: '', senha: '' },
        handleChange: mockHandleChange,
        handleSubmit: mockHandleSubmit,
        isLoading: true,
      });

      render(<Login />);

      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });
});
