import { render, screen } from '@testing-library/react';

// Mocks
jest.mock('@/providers/UserAuthProvider', () => ({
  useUserAuth: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

import ApplicationLayout from './layout';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { notFound } from 'next/navigation';

describe('professores layout (admin gate)', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders children when isAdmin returns true and currentUser exists', () => {
    useUserAuth.mockReturnValue({
      isAdmin: () => true,
      currentUser: { id: 1, nome: 'Admin User', permissao: 'admin' },
    });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when currentUser exists and isAdmin returns false', () => {
    useUserAuth.mockReturnValue({
      isAdmin: () => false,
      currentUser: { id: 2, nome: 'Regular User', permissao: 'member' },
    });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(notFound).toHaveBeenCalled();
  });

  it('renders children when currentUser is null (not authenticated yet)', () => {
    useUserAuth.mockReturnValue({
      isAdmin: () => false,
      currentUser: null,
    });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('renders children when currentUser is undefined (not authenticated yet)', () => {
    useUserAuth.mockReturnValue({
      isAdmin: () => false,
      currentUser: undefined,
    });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });
});
