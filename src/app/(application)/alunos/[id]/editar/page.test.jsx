import { render } from '@testing-library/react';
import EditarAluno from './page';
import { notFound, useParams } from 'next/navigation';
import { useEditarAluno } from '@/hooks/alunos/useEditarAluno';

jest.mock('@/hooks/alunos/useEditarAluno');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/components');

const { useUserAuth } = require('@/providers/UserAuthProvider');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  notFound: jest.fn(),
}));

describe('Editar Aluno Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor Test' },
    });

    useEditarAluno.mockReturnValue({
      aluno: { id: 1, nome: 'Aluno 1', email: 'aluno1@test.com' },
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      isNotFound: false,
      errors: [],
    });
  });

  it('renders editar aluno page', () => {
    render(<EditarAluno />);
    expect(useEditarAluno).toHaveBeenCalled();
  });

  it('calls notFound when aluno not found', () => {
    useEditarAluno.mockReturnValue({
      aluno: null,
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      isNotFound: true,
      errors: [],
    });

    render(<EditarAluno />);
    expect(notFound).toHaveBeenCalled();
  });
});
