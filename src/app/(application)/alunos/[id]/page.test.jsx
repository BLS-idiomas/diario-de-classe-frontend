import { render } from '@testing-library/react';
import Aluno from './page';
import { notFound, useParams } from 'next/navigation';
import { useAluno } from '@/hooks/alunos/useAluno';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';

jest.mock('@/hooks/alunos/useAluno');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/components');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  notFound: jest.fn(),
}));

describe('Aluno Detail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useAluno.mockReturnValue({
      aluno: { id: 1, nome: 'Aluno 1', email: 'aluno1@test.com' },
      isLoading: false,
      isNotFound: false,
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useAulasList.mockReturnValue({
      columns: [],
      data: [],
    });
  });

  it('renders aluno detail page', () => {
    render(<Aluno />);
    expect(useAluno).toHaveBeenCalled();
  });

  it('calls notFound when aluno not found', () => {
    useAluno.mockReturnValue({
      aluno: null,
      isLoading: false,
      isNotFound: true,
    });

    render(<Aluno />);
    expect(notFound).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useAluno.mockReturnValue({
      aluno: null,
      isLoading: true,
      isNotFound: false,
    });

    render(<Aluno />);
    expect(useAluno).toHaveBeenCalled();
  });
});
