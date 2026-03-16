import { render } from '@testing-library/react';
import Professores from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useProfessores } from '@/hooks/professores/useProfessores';
import { useDeletarProfessor } from '@/hooks/professores/useDeletarProfessor';
import { useFormater } from '@/hooks/useFormater';
import { useProfessoresList } from '@/hooks/professores/useProfessoresList';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/professores/useDeletarProfessor');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/professores/useProfessoresList');
jest.mock('@/components');

describe('Professores List Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Admin' },
      isAdmin: () => true,
    });

    useProfessores.mockReturnValue({
      professores: [
        { id: 1, nome: 'Professor 1', email: 'prof1@test.com' },
        { id: 2, nome: 'Professor 2', email: 'prof2@test.com' },
      ],
      isLoading: false,
      searchParams: {},
    });

    useDeletarProfessor.mockReturnValue({
      handleDeleteProfessor: jest.fn(),
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useProfessoresList.mockReturnValue({
      columns: [{ Header: 'Nome', accessor: 'nome' }],
      data: [
        { id: 1, nome: 'Professor 1', email: 'prof1@test.com' },
        { id: 2, nome: 'Professor 2', email: 'prof2@test.com' },
      ],
    });
  });

  it('renders professores list page', () => {
    render(<Professores />);
    expect(useProfessores).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useProfessores.mockReturnValue({
      professores: [],
      isLoading: true,
      searchParams: {},
    });

    render(<Professores />);
    expect(useProfessores).toHaveBeenCalled();
  });

  it('renders with professores data', () => {
    render(<Professores />);
    expect(useProfessoresList).toHaveBeenCalled();
  });
});
