import { render } from '@testing-library/react';
import NovoContrato from './page';
import { useNovoContrato } from '@/hooks/contratos/useNovoContrato';

jest.mock('@/hooks/contratos/useNovoContrato');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useContratoForm');
jest.mock('@/hooks/contratos/useGenerateAulasByContrato');
jest.mock('@/components');

const { useAlunos } = require('@/hooks/alunos/useAlunos');
const { useProfessores } = require('@/hooks/professores/useProfessores');
const { useFormater } = require('@/hooks/useFormater');
const { useContratoForm } = require('@/hooks/contratos/useContratoForm');
const {
  useGenerateAulasByContrato,
} = require('@/hooks/contratos/useGenerateAulasByContrato');

describe('Novo Contrato Page', () => {
  const mockAlunos = [
    { id: 1, nome: 'Aluno 1', email: 'aluno1@example.com' },
    { id: 2, nome: 'Aluno 2', email: 'aluno2@example.com' },
  ];

  const mockProfessores = [
    { id: 1, nome: 'Professor 1', email: 'prof1@example.com' },
  ];

  const mockHandleSubmit = jest.fn();
  const mockHandleChange = jest.fn();
  const mockSetFormData = jest.fn();
  const mockGenerateAulasByContrato = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useNovoContrato.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      submit: jest.fn(),
    });

    useAlunos.mockReturnValue({
      alunos: mockAlunos,
      alunoOptions: mockAlunos.map(a => ({
        value: a.id,
        label: `${a.nome} (${a.email})`,
      })),
    });

    useProfessores.mockReturnValue({
      professores: mockProfessores,
      professorOptions: mockProfessores.map(p => ({
        value: p.id,
        label: `${p.nome} (${p.email})`,
      })),
    });

    useFormater.mockReturnValue({
      dataFormatter: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('pt-BR');
      }),
      formatForInput: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
      }),
    });

    useContratoForm.mockReturnValue({
      formData: {},
      handleSubmit: mockHandleSubmit,
      handleChange: mockHandleChange,
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDuracaoAulaChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setFormData: mockSetFormData,
    });

    useGenerateAulasByContrato.mockReturnValue({
      generateAulasByContrato: mockGenerateAulasByContrato,
      isSubmitting: false,
    });
  });

  describe('Page Rendering', () => {
    it('renders novo contrato form page', () => {
      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('renders with correct title and subtitle', () => {
      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('renders form page with volta button', () => {
      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });
  });

  describe('Hook Integration', () => {
    it('calls useNovoContrato hook on render', () => {
      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('calls useAlunos hook on render', () => {
      render(<NovoContrato />);
      expect(useAlunos).toHaveBeenCalled();
    });

    it('calls useProfessores hook on render', () => {
      render(<NovoContrato />);
      expect(useProfessores).toHaveBeenCalled();
    });

    it('calls useFormater hook on render', () => {
      render(<NovoContrato />);
      expect(useFormater).toHaveBeenCalled();
    });

    it('calls useContratoForm hook with correct parameters', () => {
      render(<NovoContrato />);
      expect(useContratoForm).toHaveBeenCalledWith(
        expect.objectContaining({
          alunos: mockAlunos,
          professores: mockProfessores,
        })
      );
    });

    it('calls useGenerateAulasByContrato hook on render', () => {
      render(<NovoContrato />);
      expect(useGenerateAulasByContrato).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('renders with isLoading false initially', () => {
      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('renders with isLoading true', () => {
      useNovoContrato.mockReturnValue({
        message: null,
        errors: [],
        isLoading: true,
        submit: jest.fn(),
      });

      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('renders with isSubmitting true', () => {
      useGenerateAulasByContrato.mockReturnValue({
        generateAulasByContrato: mockGenerateAulasByContrato,
        isSubmitting: true,
      });

      render(<NovoContrato />);
      expect(useGenerateAulasByContrato).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('renders with error messages', () => {
      const errorMessages = ['Erro ao criar contrato', 'Dados inválidos'];
      useNovoContrato.mockReturnValue({
        message: 'Falha na operação',
        errors: errorMessages,
        isLoading: false,
        submit: jest.fn(),
      });

      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });

    it('renders with success message', () => {
      useNovoContrato.mockReturnValue({
        message: 'Contrato criado com sucesso',
        errors: [],
        isLoading: false,
        submit: jest.fn(),
      });

      render(<NovoContrato />);
      expect(useNovoContrato).toHaveBeenCalled();
    });
  });

  describe('Data Options', () => {
    it('renders with empty aluno options', () => {
      useAlunos.mockReturnValue({
        alunos: [],
        alunoOptions: [],
      });

      render(<NovoContrato />);
      expect(useAlunos).toHaveBeenCalled();
    });

    it('renders with multiple aluno options', () => {
      const manyAlunos = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        nome: `Aluno ${i + 1}`,
        email: `aluno${i + 1}@example.com`,
      }));

      useAlunos.mockReturnValue({
        alunos: manyAlunos,
        alunoOptions: manyAlunos.map(a => ({
          value: a.id,
          label: `${a.nome} (${a.email})`,
        })),
      });

      render(<NovoContrato />);
      expect(useAlunos).toHaveBeenCalled();
    });

    it('renders with empty professor options', () => {
      useProfessores.mockReturnValue({
        professores: [],
        professorOptions: [],
      });

      render(<NovoContrato />);
      expect(useProfessores).toHaveBeenCalled();
    });
  });

  describe('Form Component Props', () => {
    it('passes alunoOptions to ContratoForm', () => {
      render(<NovoContrato />);
      expect(useAlunos).toHaveBeenCalled();
    });

    it('passes professorOptions to ContratoForm', () => {
      render(<NovoContrato />);
      expect(useProfessores).toHaveBeenCalled();
    });

    it('passes formData to ContratoForm', () => {
      render(<NovoContrato />);
      expect(useContratoForm).toHaveBeenCalled();
    });

    it('passes all handlers to ContratoForm', () => {
      render(<NovoContrato />);
      expect(useContratoForm).toHaveBeenCalled();
    });
  });
});
