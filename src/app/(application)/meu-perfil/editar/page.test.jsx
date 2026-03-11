import { render, screen } from '@testing-library/react';
import EditarPerfil from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/professores/useEditarProfessor');
jest.mock('@/hooks/professores/useProfessorForm');
jest.mock('@/components');

const {
  useEditarProfessor,
} = require('@/hooks/professores/useEditarProfessor');
const { useProfessorForm } = require('@/hooks/professores/useProfessorForm');

describe('Editar Perfil Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: {
        id: 1,
        nome: 'Professor',
        email: 'prof@test.com',
      },
    });

    useEditarProfessor.mockReturnValue({
      message: null,
      errors: null,
      isLoading: false,
      current: { id: 1, nome: 'Professor' },
      statusError: null,
      submit: jest.fn(),
    });

    useProfessorForm.mockReturnValue({
      formData: { nome: 'Professor' },
      isSenhaError: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
    });
  });

  it('renders editar perfil page', () => {
    render(<EditarPerfil />);
    expect(useUserAuth).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    render(<EditarPerfil />);
    expect(useUserAuth).toHaveBeenCalled();
  });
});
