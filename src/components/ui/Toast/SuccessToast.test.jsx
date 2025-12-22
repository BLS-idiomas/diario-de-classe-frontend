import { render, screen, fireEvent } from '@testing-library/react';
import { SuccessToast } from './index.jsx';

describe('SuccessToast', () => {
  const mockToast = {
    id: 2,
    message: 'Operation completed successfully!',
    type: 'success',
    duration: 5000,
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render success toast with correct message', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    expect(
      screen.getByText('Operation completed successfully!')
    ).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render with green icon and styling', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const iconContainer = screen.getByRole('alert').querySelector('div > div');
    expect(iconContainer).toHaveClass(
      'text-green-500',
      'bg-green-100',
      'dark:bg-green-800',
      'dark:text-green-200'
    );
  });

  it('should render the check mark icon', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    // Verifica se o SVG com o viewBox específico do ícone de check está presente
    const checkIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 16 12"]');
    expect(checkIcon).toBeInTheDocument();

    // Verifica se o path do check mark está presente
    const checkPath = checkIcon.querySelector(
      'path[d="M1 5.917 5.724 10.5 15 1.5"]'
    );
    expect(checkPath).toBeInTheDocument();
  });

  it('should have correct aria-label and screen reader support', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText('success icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument(); // sr-only text
  });

  it('should call onClose with correct toast id when close button is clicked', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(mockToast.id);
  });

  it('should inherit default toast styling from DefaultToast', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

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

  it('should render close button with X icon', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    // Verifica se o componente X do lucide-react está presente
    const xIcon = closeButton.querySelector('svg');
    expect(xIcon).toBeInTheDocument();
    expect(xIcon).toHaveClass('w-3', 'h-3');
  });

  it('should handle hover and focus states on close button', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toHaveClass(
      'hover:text-gray-900',
      'hover:bg-gray-100',
      'focus:ring-2',
      'focus:ring-gray-300'
    );
  });

  it('should display message with correct typography', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const messageElement = screen.getByText(
      'Operation completed successfully!'
    );
    expect(messageElement).toHaveClass('ms-3', 'text-sm', 'font-normal');
  });

  it('should render icon with correct stroke properties', () => {
    render(<SuccessToast toast={mockToast} onClose={mockOnClose} />);

    const checkIcon = screen
      .getByRole('alert')
      .querySelector('svg[viewBox="0 0 16 12"]');
    const path = checkIcon.querySelector('path');

    expect(path).toHaveAttribute('stroke', 'currentColor');
    expect(path).toHaveAttribute('stroke-linecap', 'round');
    expect(path).toHaveAttribute('stroke-linejoin', 'round');
    expect(path).toHaveAttribute('stroke-width', '2');
  });

  it('should handle different success messages', () => {
    const customToast = {
      ...mockToast,
      message: 'User created successfully!',
      id: 123,
    };

    render(<SuccessToast toast={customToast} onClose={mockOnClose} />);

    expect(screen.getByText('User created successfully!')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(123);
  });
});
