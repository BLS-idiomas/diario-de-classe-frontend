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

  it('renders children when isAdmin returns true', () => {
    useUserAuth.mockReturnValue({ isAdmin: () => true });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('calls notFound when isAdmin returns false', () => {
    useUserAuth.mockReturnValue({ isAdmin: () => false });
    render(
      <ApplicationLayout>
        <div data-testid="child">conteúdo</div>
      </ApplicationLayout>
    );
    expect(notFound).toHaveBeenCalled();
  });
});
