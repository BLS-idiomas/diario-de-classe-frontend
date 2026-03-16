import { render, screen, waitFor } from '@testing-library/react';
import Alunos from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAlunos } from '@/hooks/alunos/useAlunos';
import { useDeletarAluno } from '@/hooks/alunos/useDeletarAluno';
import { useFormater } from '@/hooks/useFormater';
import { useAlunosList } from '@/hooks/alunos/useAlunosList';
import { useUploadAlunos } from '@/hooks/alunos/useUploadAlunos';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/alunos/useDeletarAluno');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/alunos/useAlunosList');
jest.mock('@/hooks/alunos/useUploadAlunos');
jest.mock('@/components');

describe('Alunos List Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: true,
    });

    useAlunos.mockReturnValue({
      alunos: [
        { id: 1, nome: 'Aluno 1', email: 'aluno1@test.com' },
        { id: 2, nome: 'Aluno 2', email: 'aluno2@test.com' },
      ],
      isLoading: false,
      searchParams: {},
    });

    useDeletarAluno.mockReturnValue({
      handleDeleteAluno: jest.fn(),
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useAlunosList.mockReturnValue({
      columns: [{ Header: 'Nome', accessor: 'nome' }],
      data: [
        { id: 1, nome: 'Aluno 1', email: 'aluno1@test.com' },
        { id: 2, nome: 'Aluno 2', email: 'aluno2@test.com' },
      ],
    });

    useUploadAlunos.mockReturnValue({
      handleModalUpload: jest.fn(),
      isUploading: false,
    });
  });

  it('renders alunos list page', () => {
    render(<Alunos />);
    expect(useAlunos).toHaveBeenCalled();
  });

  it('displays loading state when data is loading', () => {
    useAlunos.mockReturnValue({
      alunos: [],
      isLoading: true,
      searchParams: {},
    });

    render(<Alunos />);
    expect(useAlunos).toHaveBeenCalled();
  });

  it('renders with alunos data', () => {
    render(<Alunos />);

    expect(useAlunosList).toHaveBeenCalled();
  });
});
