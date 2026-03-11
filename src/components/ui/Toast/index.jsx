'use client';

import { X } from 'lucide-react';

const DefaultToast = ({ toast, onClose, icon = null, iconColor = null }) => {
  const toastIconColor = iconColor || 'toast-info';
  const toastIcon = icon || (
    <svg
      className="w-4 h-4"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
      />
    </svg>
  );

  return (
    <div
      className="flex items-center w-full max-w-xs p-4 transition-all duration-300 ease-in-out animate-in slide-in-from-right toast"
      role="alert"
      data-testid="toast"
    >
      <div
        className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${toastIconColor}`}
      >
        {toastIcon}
        <span className="sr-only">{toast.type} icon</span>
      </div>

      <div className="ms-3 text-sm font-normal">{toast.message}</div>

      <button
        type="button"
        className="ms-2 -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors"
        onClick={() => onClose(toast.id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export const InfoToast = DefaultToast;

export const SuccessToast = ({ toast, onClose }) => (
  <DefaultToast
    toast={toast}
    onClose={onClose}
    iconColor="toast-success"
    icon={
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 12"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 5.917 5.724 10.5 15 1.5"
        />
      </svg>
    }
  />
);

export const ErrorToast = ({ toast, onClose }) => (
  <DefaultToast
    toast={toast}
    onClose={onClose}
    iconColor="toast-error"
    icon={
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    }
  />
);

export const WarningToast = ({ toast, onClose }) => (
  <DefaultToast
    toast={toast}
    onClose={onClose}
    iconColor="toast-warning"
    icon={
      <svg
        className="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    }
  />
);
