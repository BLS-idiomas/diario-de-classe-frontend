'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  ErrorToast,
  SuccessToast,
  WarningToast,
  InfoToast,
} from '../components';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(id => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 5000, Toast = InfoToast) => {
      const id = Date.now() + Math.random();
      const newToast = {
        id,
        message,
        type,
        duration,
        Toast,
      };

      setToasts(current => [...current, newToast]);

      // Auto remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const success = useCallback(
    (message, duration) => {
      return addToast(message, 'success', duration, SuccessToast);
    },
    [addToast]
  );

  const error = useCallback(
    (message, duration) => {
      return addToast(message, 'error', duration, ErrorToast);
    },
    [addToast]
  );

  const warning = useCallback(
    (message, duration) => {
      return addToast(message, 'warning', duration, WarningToast);
    },
    [addToast]
  );

  const info = useCallback(
    (message, duration) => {
      return addToast(message, 'info', duration, InfoToast);
    },
    [addToast]
  );

  const getToastComponent = toast => {
    const { id, Toast } = toast;
    return <Toast key={id} toast={toast} onClose={removeToast} />;
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => getToastComponent(toast))}
      </div>
    </ToastContext.Provider>
  );
};
