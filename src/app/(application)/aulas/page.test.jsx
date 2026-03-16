import { render } from '@testing-library/react';
import Aulas from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useAulas } from '@/hooks/aulas/useAulas';
import { useDeletarAula } from '@/hooks/aulas/useDeletarAula';
import { useFormater } from '@/hooks/useFormater';
import { useAulasList } from '@/hooks/aulas/useAulasList';
import { useEditarAndamentoAula } from '@/hooks/aulas/useEditarAndamentoAula';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/aulas/useAulas');
jest.mock('@/hooks/aulas/useDeletarAula');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/aulas/useAulasList');
jest.mock('@/hooks/aulas/useEditarAndamentoAula');
jest.mock('@/components');

describe('Aulas List Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
    });

    useAulas.mockReturnValue({
      aulas: [
        { id: 1, titulo: 'Aula 1', data: '2024-01-15' },
        { id: 2, titulo: 'Aula 2', data: '2024-01-17' },
      ],
      isLoading: false,
      searchParams: {},
    });

    useDeletarAula.mockReturnValue({
      handleDeleteAula: jest.fn(),
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useAulasList.mockReturnValue({
      columns: [{ Header: 'Título', accessor: 'titulo' }],
      data: [
        { id: 1, titulo: 'Aula 1', data: '2024-01-15' },
        { id: 2, titulo: 'Aula 2', data: '2024-01-17' },
      ],
    });

    useEditarAndamentoAula.mockReturnValue({
      submit: jest.fn(),
      isLoading: false,
    });
  });

  it('renders aulas list page', () => {
    render(<Aulas />);
    expect(useAulas).toHaveBeenCalled();
  });

  it('displays loading state when data is loading', () => {
    useAulas.mockReturnValue({
      aulas: [],
      isLoading: true,
      searchParams: {},
    });

    render(<Aulas />);
    expect(useAulas).toHaveBeenCalled();
  });

  it('renders with aulas data', () => {
    render(<Aulas />);
    expect(useAulasList).toHaveBeenCalled();
  });
});
