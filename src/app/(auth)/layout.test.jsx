import { render } from '@testing-library/react';
import AuthLayout from './layout';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';

jest.mock('@/providers/UserAuthProvider', () => ({ useUserAuth: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

describe('AuthLayout', () => {
  let routerMock, successMock, isAuthenticatedMock;

  beforeEach(() => {
    routerMock = { push: jest.fn() };
    successMock = jest.fn();
    isAuthenticatedMock = jest.fn();
    useRouter.mockReturnValue(routerMock);
    useToast.mockReturnValue({ success: successMock });
    useUserAuth.mockReturnValue({
      currentUser: { nome: 'Marcos' },
      isAuthenticated: isAuthenticatedMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children inside layout', () => {
    const { getByTestId } = render(
      <AuthLayout>
        <div data-testid="child">Conteúdo</div>
      </AuthLayout>
    );
    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('should call success and redirect if authenticated', async () => {
    isAuthenticatedMock.mockResolvedValue(true);
    render(
      <AuthLayout>
        <div data-testid="child">Conteúdo</div>
      </AuthLayout>
    );
    // aguarda o microtask do useEffect
    await Promise.resolve();
    expect(successMock).toHaveBeenCalledWith('Bem-vindo de volta, Marcos!');
    expect(routerMock.push).toHaveBeenCalledWith('/');
  });

  it('should not call success or redirect if not authenticated', async () => {
    isAuthenticatedMock.mockResolvedValue(false);
    render(
      <AuthLayout>
        <div data-testid="child">Conteúdo</div>
      </AuthLayout>
    );
    await Promise.resolve();
    expect(successMock).not.toHaveBeenCalled();
    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
