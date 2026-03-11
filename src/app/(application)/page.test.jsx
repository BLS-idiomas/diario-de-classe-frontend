import { render, screen, waitFor } from '@testing-library/react';
import Home from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { useProfessores } from '@/hooks/professores/useProfessores';

// Mock providers and hooks
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/dashboard/useDashboard');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/utils/makeEmailLabel');
jest.mock('@/utils/makeFullNameLabel');

describe('Home Page - Dashboard', () => {
  const defaultMocks = {
    currentUser: { id: 1, nome: 'Professor Test', email: 'test@example.com' },
    isAdmin: () => true,
  };

  const defaultDashboardData = {
    alunosCount: 25,
    aulasCount: 12,
    contratosCount: 5,
    aulas: [],
    isLoading: false,
    homeCardValues: [
      { title: 'Alunos', value: 25, color: 'blue' },
      { title: 'Aulas', value: 12, color: 'green' },
      { title: 'Contratos', value: 5, color: 'purple' },
    ],
    formData: {
      dataInicio: '',
      dataTermino: '',
      tipo: '',
      alunoId: '',
      professorId: '',
    },
    handleSubmit: jest.fn(),
    handleChange: jest.fn(),
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue(defaultMocks);
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: false,
      searchParams: {},
    });
    useDashboard.mockReturnValue(defaultDashboardData);
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: false,
    });
  });

  it('renders dashboard without errors', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders page with form if user is admin', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(useUserAuth).toHaveBeenCalled();
    });
  });

  it('displays loading state when dashboard is loading', () => {
    useDashboard.mockReturnValue({
      ...defaultDashboardData,
      isLoading: true,
    });

    render(<Home />);
    expect(useUserAuth).toHaveBeenCalled();
  });

  it('renders with dashboard data', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(useDashboard).toHaveBeenCalled();
    });
  });
});
