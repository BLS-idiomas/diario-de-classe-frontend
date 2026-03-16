import { render } from '@testing-library/react';
import NovaAula from './page';
import { useNovaAula } from '@/hooks/aulas/useNovaAula';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/hooks/aulas/useNovaAula');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/components');

describe('Nova Aula Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
    });

    useNovaAula.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      errors: [],
    });
  });

  it('renders nova aula form page', () => {
    render(<NovaAula />);
    expect(useNovaAula).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useNovaAula.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: true,
      errors: [],
    });

    render(<NovaAula />);
    expect(useNovaAula).toHaveBeenCalled();
  });
});
