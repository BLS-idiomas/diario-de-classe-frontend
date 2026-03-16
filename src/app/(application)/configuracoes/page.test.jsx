import { render } from '@testing-library/react';
import Configuracao from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useConfiguracao } from '@/hooks/configuracoes/useConfiguracao';
import { useConfiguracaoForm } from '@/hooks/configuracoes/useConfiguracaoForm';

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/configuracoes/useConfiguracao');
jest.mock('@/hooks/configuracoes/useConfiguracaoForm');
jest.mock('@/components');

const { notFound } = require('next/navigation');

describe('Configuracao Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => true,
    });

    useConfiguracao.mockReturnValue({
      configuracao: { id: 1, diasTrabalho: 5 },
      isLoading: false,
      isNotFound: false,
    });

    useConfiguracaoForm.mockReturnValue({
      formData: {
        diasDeFuncionamento: [],
      },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
    });
  });

  it('renders configuracao page', () => {
    render(<Configuracao />);
    expect(useUserAuth).toHaveBeenCalled();
  });

  it('calls notFound when configuracao not found', () => {
    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: () => false,
    });

    useConfiguracao.mockReturnValue({
      configuracao: null,
      isLoading: false,
      isNotFound: true,
    });

    render(<Configuracao />);
    expect(notFound).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useConfiguracao.mockReturnValue({
      configuracao: null,
      isLoading: true,
      isNotFound: false,
    });

    render(<Configuracao />);
    expect(useConfiguracao).toHaveBeenCalled();
  });
});
