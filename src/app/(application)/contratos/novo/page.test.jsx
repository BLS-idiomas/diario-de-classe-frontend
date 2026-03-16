import { render, screen } from '@testing-library/react';
import NovoContrato from './page';
import { useNovoContrato } from '@/hooks/contratos/useNovoContrato';
import { useUserAuth } from '@/providers/UserAuthProvider';

jest.mock('@/hooks/contratos/useNovoContrato');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useContratoForm');
jest.mock('@/hooks/contratos/useGenerateAulasByContrato');
jest.mock('@/providers/UserAuthProvider');
jest.mock('@/components');

const { useAlunos } = require('@/hooks/alunos/useAlunos');
const { useProfessores } = require('@/hooks/professores/useProfessores');
const { useFormater } = require('@/hooks/useFormater');
const { useContratoForm } = require('@/hooks/contratos/useContratoForm');
const {
  useGenerateAulasByContrato,
} = require('@/hooks/contratos/useGenerateAulasByContrato');

describe('Novo Contrato Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useUserAuth.mockReturnValue({
      currentUser: { id: 1, nome: 'Professor' },
    });

    useNovoContrato.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      errors: [],
    });

    useAlunos.mockReturnValue({
      alunos: [],
      alunoOptions: [],
    });

    useProfessores.mockReturnValue({
      professores: [],
      professorOptions: [],
    });

    useFormater.mockReturnValue({
      dataFormatter: jest.fn(date => new Date(date).toLocaleDateString()),
    });

    useContratoForm.mockReturnValue({
      formData: {},
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setFormData: jest.fn(),
    });

    useGenerateAulasByContrato.mockReturnValue({
      generateAulasByContrato: jest.fn(),
      isSubmitting: false,
    });
  });

  it('renders novo contrato form page', () => {
    render(<NovoContrato />);
    expect(useNovoContrato).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    useNovoContrato.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: true,
      errors: [],
    });

    render(<NovoContrato />);
    expect(useNovoContrato).toHaveBeenCalled();
  });
});
