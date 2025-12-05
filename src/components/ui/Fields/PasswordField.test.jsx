import { render, screen, fireEvent } from '@testing-library/react';
import { PasswordField } from './PasswordField';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eyeoff-icon">EyeOff</div>,
}));

describe('PasswordField', () => {
  it('renders label and input with correct props', () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
        required
        placeholder="Digite sua senha"
        inputGroupClass="group-class"
        labelClass="label-class"
        className="custom-class"
      />
    );
    const input = screen.getByPlaceholderText('Digite sua senha');
    expect(input).toHaveAttribute('id', 'senha');
    expect(input).toHaveAttribute('name', 'senha');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('placeholder', 'Digite sua senha');
    expect(input).toHaveClass('custom-class');
    expect(input.value).toBe('test123');
  });

  it('starts with password type hidden', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
      />
    );
    const input = container.querySelector('#senha');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows Eye icon when password is hidden', () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
      />
    );
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eyeoff-icon')).not.toBeInTheDocument();
  });

  it('toggles password visibility when clicking the toggle button', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
      />
    );
    const input = container.querySelector('#senha');
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });

    // Initially password is hidden
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

    // Click to show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('eyeoff-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eye-icon')).not.toBeInTheDocument();

    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('eyeoff-icon')).not.toBeInTheDocument();
  });

  it('updates aria-label when toggling visibility', () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
      />
    );
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });

    // Initially shows "Mostrar senha"
    expect(toggleButton).toHaveAttribute('aria-label', 'Mostrar senha');

    // After clicking, shows "Ocultar senha"
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-label', 'Ocultar senha');

    // After clicking again, back to "Mostrar senha"
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-label', 'Mostrar senha');
  });

  it('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value=""
        onChange={handleChange}
      />
    );
    const input = container.querySelector('#senha');

    fireEvent.change(input, { target: { value: 'newpassword' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with empty value when value is not provided', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PasswordField htmlFor="senha" label="Senha" onChange={handleChange} />
    );
    const input = container.querySelector('#senha');
    expect(input.value).toBe('');
  });

  it('toggle button has correct type attribute to prevent form submission', () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        htmlFor="senha"
        label="Senha"
        value="test123"
        onChange={handleChange}
      />
    );
    const toggleButton = screen.getByRole('button', { name: /mostrar senha/i });
    expect(toggleButton).toHaveAttribute('type', 'button');
  });
});
