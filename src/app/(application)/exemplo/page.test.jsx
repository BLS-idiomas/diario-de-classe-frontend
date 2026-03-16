import { render } from '@testing-library/react';
import Exemplo from './page';

jest.mock('@/components');
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  }),
}));
jest.mock('@/hooks/useSweetAlert', () => ({
  useSweetAlert: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarning: jest.fn(),
    showInfo: jest.fn(),
    showConfirm: jest.fn(),
    showDeleteConfirm: jest.fn(),
    showInput: jest.fn(),
    showLoading: jest.fn(),
    showToast: jest.fn(),
  }),
}));

describe('Exemplo Page', () => {
  it('renders exemplo page', () => {
    render(<Exemplo />);
    expect(true).toBe(true);
  });

  it('renders without errors', () => {
    const { container } = render(<Exemplo />);
    expect(container).toBeInTheDocument();
  });
});
