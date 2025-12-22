import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonsFields } from './index.jsx';

// Mock next/link for testing
jest.mock('next/link', () => {
  const MockLink = ({ children, ...props }) => <a {...props}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('ButtonsFields', () => {
  it('renders submit and cancel buttons', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={false} href="/test" />
    );
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('shows loading text when isLoading', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={true} href="/test" />
    );
    expect(
      screen.getByRole('button', { name: /criando/i })
    ).toBeInTheDocument();
  });

  it('disables submit button when isSubmitting', () => {
    render(<ButtonsFields isLoading={true} href="/test" />);
    expect(screen.getByRole('button', { name: /criando/i })).toBeDisabled();
  });

  it('cancel link navigates to href', () => {
    render(
      <ButtonsFields isSubmitting={false} isLoading={false} href="/cancel" />
    );
    const cancelLink = screen.getByRole('link', { name: /cancelar/i });
    expect(cancelLink).toHaveAttribute('href', '/cancel');
  });
});
