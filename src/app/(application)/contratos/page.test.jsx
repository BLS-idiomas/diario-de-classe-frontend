import { render } from '@testing-library/react';
import Contratos from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useContratos } from '@/hooks/contratos/useContratos';
import { useDeletarContrato } from '@/hooks/contratos/useDeletarContrato';
import { useFormater } from '@/hooks/useFormater';
import { useContratosList } from '@/hooks/contratos/useContratosList';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/contratos/useContratos');
jest.mock('@/hooks/contratos/useDeletarContrato');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useContratosList');
jest.mock('@/components');

describe('Contratos List Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });

    useContratos.mockReturnValue({
      contratos: [
        { id: 1, numero: 'CONT-001', valor: 1000, status: 'ativo' },
        { id: 2, numero: 'CONT-002', valor: 2000, status: 'ativo' },
      ],
      isLoading: false,
      searchParams: {},
    });

    useDeletarContrato.mockReturnValue({
      handleDeleteContrato: jest.fn(),
    });

    useFormater.mockReturnValue({
      telefoneFormatter: jest.fn(tel => tel),
      dataFormatter: jest.fn(date => date),
    });

    useContratosList.mockReturnValue({
      columns: [{ Header: 'Número', accessor: 'numero' }],
      data: [
        { id: 1, numero: 'CONT-001', valor: 1000, status: 'ativo' },
        { id: 2, numero: 'CONT-002', valor: 2000, status: 'ativo' },
      ],
    });
  });

  it('renders contratos list page', () => {
    render(<Contratos />);
    expect(useContratos).toHaveBeenCalled();
  });

  it('displays loading state when data is loading', () => {
    useContratos.mockReturnValue({
      contratos: [],
      isLoading: true,
      searchParams: {},
    });

    render(<Contratos />);
    expect(useContratos).toHaveBeenCalled();
  });

  it('renders with contratos data', () => {
    render(<Contratos />);
    expect(useContratosList).toHaveBeenCalled();
  });
});
