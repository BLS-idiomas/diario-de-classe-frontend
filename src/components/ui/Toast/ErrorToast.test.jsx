import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorToast } from './index.jsx';

describe('ErrorToast', () => {
  const mockToast = {
    id: 3,
    message: 'An error occurred while processing your request',
    type: 'error',
    duration: 5000,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error toast with correct message', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    expect(
      screen.getByText('An error occurred while processing your request')
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render with red icon and styling', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass(
      'text-red-500',
      'bg-red-100',
      'dark:bg-red-800',
      'dark:text-red-200'
    );
  });

  it('should render the X mark icon', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    // Verifica se o SVG com o viewBox específico do ícone de X está presente
    const xIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 14 14"]');
    expect(xIcon).toBeInTheDocument();

    // Verifica se o path do X mark está presente
    const xPath = xIcon.querySelector(
      'path[d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"]'
    );
    expect(xPath).toBeInTheDocument();
  });

  it('should have correct aria-label and screen reader support', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText('error icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument(); // sr-only text
  });

  it('should call onClose with correct toast id when close button is clicked', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(mockToast.id);
  });

  it('should inherit default toast styling from DefaultToast', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

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
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    // Verifica se o componente X do lucide-react está presente no botão
    const xIcon = closeButton.querySelector('svg');
    expect(xIcon).toBeInTheDocument();
    expect(xIcon).toHaveClass('w-3', 'h-3');
  });

  it('should render error icon with correct stroke properties', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    const errorIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 14 14"]');
    const path = errorIcon.querySelector('path');

    expect(path).toHaveAttribute('stroke', 'currentColor');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
  });

  it('should handle long error messages', () => {
    const longErrorToast = {
      ...mockToast,
      message:
        'This is a very long error message that should still be displayed properly within the toast container without breaking the layout or causing visual issues',
      id: 456,
    };

    render(<ErrorToast toast={longErrorToast} onClose={mockOnClose} />);

    expect(screen.getByText(longErrorToast.message)).toBeInTheDocument();

    // Verifica se o container ainda mantém a largura máxima
    const toastContainer = screen.getByRole('alert');
    expect(toastContainer).toHaveClass('max-w-xs');
  });

  it('should display message with correct typography', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    const messageElement = screen.getByText(
      'An error occurred while processing your request'
    );
    expect(messageElement).toHaveClass('ms-3', 'text-sm', 'font-normal');
  });

  it('should have proper icon container sizing and positioning', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

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

  it('should handle different error types and ids', () => {
    const networkErrorToast = {
      id: 789,
      message: 'Network connection failed',
      type: 'error',
      duration: 0, // Persistent error
    };

    render(<ErrorToast toast={networkErrorToast} onClose={mockOnClose} />);

    expect(screen.getByText('Network connection failed')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(789);
  });

  it('should maintain accessibility standards', () => {
    render(<ErrorToast toast={mockToast} onClose={mockOnClose} />);

    // Verifica role alert para screen readers
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Verifica se o ícone tem texto alternativo
    expect(screen.getByText('error icon')).toBeInTheDocument();

    // Verifica se o botão de fechar é acessível
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton).toHaveClass('focus:ring-2', 'focus:ring-gray-300');
  });
});
