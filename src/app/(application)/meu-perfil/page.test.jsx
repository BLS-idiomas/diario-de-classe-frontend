import { render, screen } from '@testing-library/react';
import MeuPerfil from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/professores/useProfessor');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/alunos/useAlunosList');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/hooks/professores/useEditarDisponibilidadeProfessor');
jest.mock('@/components');

const { useProfessor } = require('@/hooks/professores/useProfessor');
const { useFormater } = require('@/hooks/useFormater');
const { useAlunosList } = require('@/hooks/alunos/useAlunosList');
const { useAulasList } = require('@/hooks/aulas/useAulasList');
const {
  useEditarDisponibilidadeProfessor,
} = require('@/hooks/professores/useEditarDisponibilidadeProfessor');

describe('Meu Perfil Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: {
        id: 1,
        nome: 'Professor',
        email: 'prof@test.com',
        telefone: '11987654321',
      },
    });

    useProfessor.mockReturnValue({
      aulas: [],
      alunos: [],
      isLoading: false,
      isNotFound: false,
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => `(11) ${tel.slice(-8)}`),
      dataFormatter: jest.fn(date => new Date(date).toLocaleDateString()),
    });

    useAlunosList.mockReturnValue({
      columns: [],
      data: [],
    });

    useAulasList.mockReturnValue({
      columns: [],
      data: [],
    });

    useEditarDisponibilidadeProfessor.mockReturnValue({
      editMode: false,
      formData: {},
      message: '',
      errors: [],
      setDisponibilidadesHandle: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
    });
  });

  it('renders meu perfil page', () => {
    render(<MeuPerfil />);
    expect(useProfessor).toHaveBeenCalled();
  });

  it('displays user data', () => {
    render(<MeuPerfil />);
    expect(useUserAuth).toHaveBeenCalled();
  });
});
