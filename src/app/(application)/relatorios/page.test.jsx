import { render } from '@testing-library/react';
import Relatorios from './page';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useRelatorios } from '@/hooks/relatorios/useRelatorios';

jest.mock('@/providers/UserAuthProvider');
jest.mock('@/hooks/relatorios/useRelatorios');
jest.mock('@/components');

describe('Relatorios Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
      isAdmin: true,
    });

    useRelatorios.mockReturnValue({
      data: [],
      file: null,
      status: 'idle',
      isLoading: false,
    });
  });

  it('renders relatorios page', () => {
    render(<Relatorios />);
    expect(useRelatorios).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useRelatorios.mockReturnValue({
      data: [],
      file: null,
      status: 'idle',
      isLoading: true,
    });

    render(<Relatorios />);
    expect(useRelatorios).toHaveBeenCalled();
  });
});
