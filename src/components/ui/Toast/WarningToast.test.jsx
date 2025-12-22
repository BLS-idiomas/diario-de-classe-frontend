import { render, screen, fireEvent } from '@testing-library/react';
import { WarningToast } from './index.jsx';

describe('WarningToast', () => {
  const mockToast = {
    id: 4,
    message: 'Please verify your data before proceeding',
    type: 'warning',
    duration: 5000,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render warning toast with correct message', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    expect(
      screen.getByText('Please verify your data before proceeding')
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render with yellow icon and styling', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass(
      'text-yellow-500',
      'bg-yellow-100',
      'dark:bg-yellow-800',
      'dark:text-yellow-200'
    );
  });

  it('should render the exclamation mark icon', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    // Verifica se o SVG com o viewBox específico do ícone de exclamação está presente
    const warningIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 20 20"]');
    expect(warningIcon).toBeInTheDocument();

    // Verifica se o path do exclamation mark está presente
    const warningPath = warningIcon.querySelector(
      'path[d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"]'
    );
    expect(warningPath).toBeInTheDocument();
  });

  it('should have correct aria-label and screen reader support', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText('warning icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument(); // sr-only text
  });

  it('should call onClose with correct toast id when close button is clicked', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(mockToast.id);
  });

  it('should inherit default toast styling from DefaultToast', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const toastContainer = screen.getByRole('alert');
    expect(toastContainer).toHaveClass(
      'flex',
      'items-center',
      'w-full',
      'max-w-xs',
      'p-4',
      'text-gray-500',
      'bg-white',
      'rounded-lg',
      'shadow-sm',
      'dark:text-gray-400',
      'dark:bg-gray-800'
    );
  });

  it('should render close button with lucide X icon', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    // Verifica se o componente X do lucide-react está presente no botão
    const xIcon = closeButton.querySelector('svg');
    expect(xIcon).toBeInTheDocument();
    expect(xIcon).toHaveClass('w-3', 'h-3');
  });

  it('should render warning icon with correct stroke properties', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const warningIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 20 20"]');
    const path = warningIcon.querySelector('path');

    expect(path).toHaveAttribute('stroke', 'currentColor');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
  });

  it('should handle different warning scenarios', () => {
    const validationWarning = {
      ...mockToast,
      message: 'Invalid email format detected',
      id: 555,
    };

    render(<WarningToast toast={validationWarning} onClose={mockOnClose} />);

    expect(
      screen.getByText('Invalid email format detected')
    ).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(555);
  });

  it('should display message with correct typography', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const messageElement = screen.getByText(
      'Please verify your data before proceeding'
    );
    expect(messageElement).toHaveClass('ms-3', 'text-sm', 'font-normal');
  });

  it('should have proper icon container sizing and positioning', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'shrink-0',
      'w-8',
      'h-8',
      'rounded-lg'
    );
  });

  it('should handle security warnings appropriately', () => {
    const securityWarning = {
      id: 666,
      message:
        'Unsecured connection detected. Please check your network settings.',
      type: 'warning',
      duration: 10000, // Longer duration for important warnings
    };

    render(<WarningToast toast={securityWarning} onClose={mockOnClose} />);

    expect(screen.getByText(securityWarning.message)).toBeInTheDocument();

    // Verifica se ainda mantém as classes de warning (amarelo)
    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass('text-yellow-500', 'bg-yellow-100');
  });

  it('should maintain proper contrast for accessibility', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');

    // Verifica se as cores têm contraste adequado para dark mode
    expect(iconContainer).toHaveClass(
      'dark:bg-yellow-800',
      'dark:text-yellow-200'
    );
  });

  it('should handle close button interactions properly', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');

    // Verifica se o botão tem as classes de hover e focus
    expect(closeButton).toHaveClass(
      'hover:text-gray-900',
      'hover:bg-gray-100',
      'focus:ring-2',
      'focus:ring-gray-300'
    );

    // Testa múltiplos cliques
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(2);
    expect(mockOnClose).toHaveBeenCalledWith(mockToast.id);
  });

  it('should render with correct warning icon sizing', () => {
    render(<WarningToast toast={mockToast} onClose={mockOnClose} />);

    const warningIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 20 20"]');
    expect(warningIcon).toHaveClass('w-4', 'h-4');
    expect(warningIcon).toHaveAttribute('aria-hidden', 'true');
  });
});
