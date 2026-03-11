import { render, screen, fireEvent } from '@testing-library/react';
import { InfoToast } from './index.jsx';

describe('InfoToast', () => {
  const mockToast = {
    id: 1,
    message: 'This is an info message',
    type: 'info',
    duration: 5000,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render info toast with correct message', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText('This is an info message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render with default blue icon and styling', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass('toast-info');
  });

  it('should render the default fire icon', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    // Verifica se o SVG com o viewBox específico do ícone de fogo está presente
    const fireIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 18 20"]');
    expect(fireIcon).toBeInTheDocument();
  });

  it('should have correct aria-label and screen reader support', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText('info icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument(); // sr-only text
  });

  it('should call onClose with correct toast id when close button is clicked', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(mockToast.id);
  });

  it('should have correct CSS classes for styling', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    const toastContainer = screen.getByRole('alert');
    expect(toastContainer).toHaveClass(
      'flex',
      'items-center',
      'w-full',
      'max-w-xs',
      'p-4',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'animate-in',
      'slide-in-from-right',
      'toast'
    );
  });

  it('should render close button with hover and focus states', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveClass(
      'ms-2',
      '-mx-1.5',
      '-my-1.5',
      'rounded-lg',
      'focus:ring-2',
      'p-1.5',
      'inline-flex',
      'items-center',
      'justify-center',
      'h-8',
      'w-8',
      'transition-colors'
    );
  });

  it('should render with correct message text styling', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

    const messageElement = screen.getByText('This is an info message');
    expect(messageElement).toHaveClass('ms-3', 'text-sm', 'font-normal');
  });

  it('should render icon container with correct sizing', () => {
    render(<InfoToast toast={mockToast} onClose={mockOnClose} />);

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

  it('should handle different toast ids correctly', () => {
    const toastWithDifferentId = { ...mockToast, id: 999 };
    render(<InfoToast toast={toastWithDifferentId} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(999);
  });
});
