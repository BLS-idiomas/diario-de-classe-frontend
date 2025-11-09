import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

// Mock dos componentes de Toast
jest.mock('../components', () => ({
  ErrorToast: ({ toast, onClose }) => (
    <div data-testid={`error-toast-${toast.id}`} role="alert">
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)}>Close Error</button>
    </div>
  ),
  SuccessToast: ({ toast, onClose }) => (
    <div data-testid={`success-toast-${toast.id}`} role="alert">
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)}>Close Success</button>
    </div>
  ),
  WarningToast: ({ toast, onClose }) => (
    <div data-testid={`warning-toast-${toast.id}`} role="alert">
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)}>Close Warning</button>
    </div>
  ),
  InfoToast: ({ toast, onClose }) => (
    <div data-testid={`info-toast-${toast.id}`} role="alert">
      <span>{toast.message}</span>
      <button onClick={() => onClose(toast.id)}>Close Info</button>
    </div>
  ),
}));

// Componente de teste básico
const TestComponent = () => {
  const {
    success,
    error,
    warning,
    info,
    removeAllToasts,
    toasts,
    addToast,
    removeToast,
  } = useToast();

  return (
    <div>
      <button onClick={() => success('Success message')}>Show Success</button>
      <button onClick={() => error('Error message')}>Show Error</button>
      <button onClick={() => warning('Warning message')}>Show Warning</button>
      <button onClick={() => info('Info message')}>Show Info</button>
      <button onClick={() => addToast('Custom message', 'info', 3000)}>
        Custom Toast
      </button>
      <button onClick={removeAllToasts}>Clear All</button>
      <button
        onClick={() => {
          if (toasts.length > 0) removeToast(toasts[0].id);
        }}
      >
        Remove First
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
      <div data-testid="toasts-data">
        {JSON.stringify(toasts.map(t => ({ id: t.id, type: t.type })))}
      </div>
    </div>
  );
};

// Componente de teste para durações customizadas
const TestDurationComponent = () => {
  const { success, error, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Quick message', 1000)}>
        Quick Success (1s)
      </button>
      <button onClick={() => error('Persistent message', 0)}>
        Persistent Error
      </button>
      <button onClick={() => info('Long message', 10000)}>
        Long Info (10s)
      </button>
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Provider Setup and Context', () => {
    it('should render children correctly', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Test Child</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should render toast container with correct positioning classes', () => {
      const { container } = render(
        <ToastProvider>
          <div>Test</div>
        </ToastProvider>
      );

      const toastContainer = container.querySelector(
        '.fixed.top-4.right-4.z-50.space-y-2'
      );
      expect(toastContainer).toBeInTheDocument();
    });

    it('should throw error when useToast is used outside provider', () => {
      const TestComponentOutside = () => {
        useToast();
        return <div>Test</div>;
      };

      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<TestComponentOutside />)).toThrow(
        'useToast must be used within a ToastProvider'
      );

      consoleSpy.mockRestore();
    });

    it('should provide all toast methods when used within provider', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByText('Show Success')).toBeInTheDocument();
      expect(screen.getByText('Show Error')).toBeInTheDocument();
      expect(screen.getByText('Show Warning')).toBeInTheDocument();
      expect(screen.getByText('Show Info')).toBeInTheDocument();
      expect(screen.getByText('Custom Toast')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByText('Remove First')).toBeInTheDocument();
    });
  });

  describe('Toast Creation and Display', () => {
    it('should create and display success toast with SuccessToast component', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Close Success')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should create and display error toast with ErrorToast component', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Error'));

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Close Error')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    });

    it('should create and display warning toast with WarningToast component', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Warning'));

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('Close Warning')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    });

    it('should create and display info toast with InfoToast component', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Info'));

      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByText('Close Info')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    });

    it('should create multiple toasts simultaneously with different types', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));
      fireEvent.click(screen.getByText('Show Info'));

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('4');
      expect(screen.getAllByRole('alert')).toHaveLength(4);
    });

    it('should use custom addToast method correctly', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Custom Toast'));

      expect(screen.getByText('Custom message')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    });
  });

  describe('Toast Removal', () => {
    it('should remove specific toast when close button is clicked', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));

      expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Close Success'));

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should remove specific toast using removeToast method', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      fireEvent.click(screen.getByText('Remove First'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('should remove all toasts when removeAllToasts is called', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));

      expect(screen.getByTestId('toast-count')).toHaveTextContent('3');

      fireEvent.click(screen.getByText('Clear All'));

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
      expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
    });

    it('should auto-remove toast after default duration (5 seconds)', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Fast forward time by 5 seconds (default duration)
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
        expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Custom Duration Handling', () => {
    it('should auto-remove toast after custom short duration', async () => {
      render(
        <ToastProvider>
          <TestDurationComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Quick Success (1s)'));
      expect(screen.getByText('Quick message')).toBeInTheDocument();

      // Fast forward time by 1 second (custom duration)
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Quick message')).not.toBeInTheDocument();
      });
    });

    it('should not auto-remove persistent toast (duration = 0)', async () => {
      render(
        <ToastProvider>
          <TestDurationComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Persistent Error'));
      expect(screen.getByText('Persistent message')).toBeInTheDocument();

      // Fast forward time by 10 seconds
      await act(async () => {
        jest.advanceTimersByTime(10000);
      });

      // Should still be there
      expect(screen.getByText('Persistent message')).toBeInTheDocument();
    });

    it('should handle custom long duration correctly', async () => {
      render(
        <ToastProvider>
          <TestDurationComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Long Info (10s)'));
      expect(screen.getByText('Long message')).toBeInTheDocument();

      // Fast forward time by 5 seconds (should still be there)
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      expect(screen.getByText('Long message')).toBeInTheDocument();

      // Fast forward time by another 5 seconds (total 10s - should be removed)
      await act(async () => {
        jest.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Long message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Toast Component Rendering', () => {
    it('should render correct toast component for each type', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Error'));
      fireEvent.click(screen.getByText('Show Warning'));
      fireEvent.click(screen.getByText('Show Info'));

      // Check if correct components are rendered based on test ids
      expect(screen.getByTestId(/success-toast-/)).toBeInTheDocument();
      expect(screen.getByTestId(/error-toast-/)).toBeInTheDocument();
      expect(screen.getByTestId(/warning-toast-/)).toBeInTheDocument();
      expect(screen.getByTestId(/info-toast-/)).toBeInTheDocument();
    });

    it('should pass correct props to toast components', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));

      const successToast = screen.getByTestId(/success-toast-/);
      expect(successToast).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Close Success')).toBeInTheDocument();
    });

    it('should generate unique IDs for each toast', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Success'));
      fireEvent.click(screen.getByText('Show Success'));

      const toastsData = JSON.parse(
        screen.getByTestId('toasts-data').textContent
      );
      const ids = toastsData.map(toast => toast.id);

      // All IDs should be unique
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(3);
      expect(ids).toHaveLength(3);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle rapid consecutive toast creation', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Rapidly create multiple toasts
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByText('Show Success'));
      }

      expect(screen.getByTestId('toast-count')).toHaveTextContent('5');
      expect(screen.getAllByText('Success message')).toHaveLength(5);
    });

    it('should handle removal of non-existent toast gracefully', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Try to remove from empty list
      fireEvent.click(screen.getByText('Remove First'));
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

      // Should not throw error
      expect(screen.getByTestId('toast-count')).toBeInTheDocument();
    });

    it('should maintain toast state consistency during concurrent operations', async () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Create multiple toasts with different durations
      fireEvent.click(screen.getByText('Show Success')); // 5s default
      fireEvent.click(screen.getByText('Custom Toast')); // 3s custom

      expect(screen.getByTestId('toast-count')).toHaveTextContent('2');

      // Fast forward to when custom toast should be removed (3s)
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.queryByText('Custom message')).not.toBeInTheDocument();
      });

      // Fast forward to when success toast should be removed (5s total)
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Context Value Completeness', () => {
    it('should provide all expected methods and properties in context', () => {
      const contextValues = [];

      const TestContextComponent = () => {
        const context = useToast();
        contextValues.push(Object.keys(context));
        return <div>Test</div>;
      };

      render(
        <ToastProvider>
          <TestContextComponent />
        </ToastProvider>
      );

      const expectedMethods = [
        'toasts',
        'addToast',
        'removeToast',
        'removeAllToasts',
        'success',
        'error',
        'warning',
        'info',
      ];

      expect(contextValues[0]).toEqual(expect.arrayContaining(expectedMethods));
      expect(contextValues[0]).toHaveLength(expectedMethods.length);
    });
  });
});
