import { render } from '@testing-library/react';
import NovoProfessor from './page';
import { useNovoProfessor } from '@/hooks/professores/useNovoProfessor';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/hooks/professores/useNovoProfessor');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/components');

describe('Novo Professor Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Admin' },
      isAdmin: true,
    });

    useNovoProfessor.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      errors: [],
    });
  });

  it('renders novo professor form page', () => {
    render(<NovoProfessor />);
    expect(useNovoProfessor).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useNovoProfessor.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: true,
      errors: [],
    });

    render(<NovoProfessor />);
    expect(useNovoProfessor).toHaveBeenCalled();
  });
});
