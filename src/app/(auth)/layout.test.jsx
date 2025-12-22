import { render, screen, waitFor } from '@testing-library/react';
import AuthLayout from './layout';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';

jest.mock('@/providers/UserAuthProvider', () => ({ useUserAuth: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

jest.mock('lucide-react', () => ({
  BookOpen: ({ size, strokeWidth }) => (
    <div
      data-testid="book-open-icon"
      data-size={size}
      data-stroke={strokeWidth}
    >
      BookOpen
    </div>
  ),
  GraduationCap: ({ size, strokeWidth }) => (
    <div
      data-testid="graduation-cap-icon"
      data-size={size}
      data-stroke={strokeWidth}
    >
      GraduationCap
    </div>
  ),
  Users: ({ size, strokeWidth }) => (
    <div data-testid="users-icon" data-size={size} data-stroke={strokeWidth}>
      Users
    </div>
  ),
}));

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

  describe('Basic Rendering', () => {
    it('should render children inside layout', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      const { getByTestId } = render(
        <AuthLayout>
          <div data-testid="child">Conteúdo</div>
        </AuthLayout>
      );
      expect(getByTestId('child')).toBeInTheDocument();
    });

    it('renders the system footer text', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      expect(
        screen.getByText('Sistema exclusivo para professores da instituição')
      ).toBeInTheDocument();
    });

    it('renders the main container with correct styling classes', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      const { container } = render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass(
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('Brand and Features Section', () => {
    it('renders the main title "Diário de Classe"', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      expect(screen.getByText('Diário de Classe')).toBeInTheDocument();
      const title = screen.getByRole('heading', { name: 'Diário de Classe' });
      expect(title).toHaveClass('text-4xl', 'font-bold');
    });

    it('renders the subtitle', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      expect(
        screen.getByText('Sistema de Registro de Aulas')
      ).toBeInTheDocument();
    });

    it('renders BookOpen icon with correct size and stroke', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const bookIcon = screen.getByTestId('book-open-icon');
      expect(bookIcon).toBeInTheDocument();
      expect(bookIcon).toHaveAttribute('data-size', '64');
      expect(bookIcon).toHaveAttribute('data-stroke', '1.5');
    });

    it('renders GraduationCap icon with correct size and stroke', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const graduationIcon = screen.getByTestId('graduation-cap-icon');
      expect(graduationIcon).toBeInTheDocument();
      expect(graduationIcon).toHaveAttribute('data-size', '24');
      expect(graduationIcon).toHaveAttribute('data-stroke', '1.5');
    });

    it('renders Users icon with correct size and stroke', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const usersIcon = screen.getByTestId('users-icon');
      expect(usersIcon).toBeInTheDocument();
      expect(usersIcon).toHaveAttribute('data-size', '24');
      expect(usersIcon).toHaveAttribute('data-stroke', '1.5');
    });

    it('renders "Gerencie suas Aulas" feature with description', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      expect(screen.getByText('Gerencie suas Aulas')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Registre e acompanhe o conteúdo de cada aula ministrada'
        )
      ).toBeInTheDocument();
    });

    it('renders "Controle de Alunos" feature with description', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      expect(screen.getByText('Controle de Alunos')).toBeInTheDocument();
      expect(
        screen.getByText('Mantenha registro completo de frequência e progresso')
      ).toBeInTheDocument();
    });
  });

  describe('Authentication Logic', () => {
    it('should call success and redirect if authenticated', async () => {
      isAuthenticatedMock.mockResolvedValue(true);
      render(
        <AuthLayout>
          <div data-testid="child">Conteúdo</div>
        </AuthLayout>
      );

      await waitFor(() => {
        expect(successMock).toHaveBeenCalledWith('Bem-vindo de volta, Marcos!');
        expect(routerMock.push).toHaveBeenCalledWith('/');
      });
    });

    it('should not call success or redirect if not authenticated', async () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div data-testid="child">Conteúdo</div>
        </AuthLayout>
      );

      await waitFor(() => {
        expect(isAuthenticatedMock).toHaveBeenCalled();
      });

      expect(successMock).not.toHaveBeenCalled();
      expect(routerMock.push).not.toHaveBeenCalled();
    });

    it('calls isAuthenticated on component mount', async () => {
      isAuthenticatedMock.mockResolvedValue(false);
      render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      await waitFor(() => {
        expect(isAuthenticatedMock).toHaveBeenCalled();
      });
    });
  });

  describe('Layout Structure', () => {
    it('renders two-column layout with left and right sections', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      const { container } = render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const layoutColumns = container.querySelectorAll('.lg\\:w-1\\/2');
      expect(layoutColumns.length).toBe(2);
    });

    it('renders decorative background circles', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      const { container } = render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const circles = container.querySelectorAll('.rounded-full');
      // 2 decorative circles + 1 main icon container
      expect(circles.length).toBeGreaterThanOrEqual(3);
    });

    it('renders left side with gradient background', () => {
      isAuthenticatedMock.mockResolvedValue(false);
      const { container } = render(
        <AuthLayout>
          <div>Content</div>
        </AuthLayout>
      );

      const leftSide = container.querySelector(
        '.bg-linear-to-br.from-blue-600.to-indigo-700'
      );
      expect(leftSide).toBeInTheDocument();
    });
  });
});
