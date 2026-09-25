'use client';

export const TransitionShell = ({ children, className }) => (
  <div
    className={`animate-app-shell-in ${className ?? ''}`}
    data-testid="transition-shell"
  >
    {children}
  </div>
);
