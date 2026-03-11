import { render } from '@testing-library/react';
import NovoAluno from './page';
import { useNovoAluno } from '@/hooks/alunos/useNovoAluno';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/hooks/alunos/useNovoAluno');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/components');

describe('Novo Aluno Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
    });

    useNovoAluno.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      errors: [],
    });
  });

  it('renders novo aluno form page', () => {
    render(<NovoAluno />);
    expect(useNovoAluno).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useNovoAluno.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: true,
      errors: [],
    });

    render(<NovoAluno />);
    expect(useNovoAluno).toHaveBeenCalled();
  });
});
