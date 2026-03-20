import { render, waitFor } from '@testing-library/react';
import EditarContrato from './page';
import { useEditarContrato } from '@/hooks/contratos/useEditarContrato';

jest.mock('@/hooks/contratos/useEditarContrato');
jest.mock('@/hooks/contratos/useContratoForm');
jest.mock('@/hooks/alunos/useAlunos');
jest.mock('@/hooks/professores/useProfessores');
jest.mock('@/hooks/useFormater');
jest.mock('@/hooks/contratos/useGenerateAulasByContrato');
jest.mock('@/components');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  notFound: jest.fn(),
}));

const {
  useEditarContrato: useEditarContratoHook,
} = require('@/hooks/contratos/useEditarContrato');
const {
  useContratoForm: useContratoFormHook,
} = require('@/hooks/contratos/useContratoForm');
const { useAlunos: useAlunosHook } = require('@/hooks/alunos/useAlunos');
const {
  useProfessores: useProfessoresHook,
} = require('@/hooks/professores/useProfessores');
const { useFormater: useFormaterHook } = require('@/hooks/useFormater');
const {
  useGenerateAulasByContrato: useGenerateAulasByContratoHook,
} = require('@/hooks/contratos/useGenerateAulasByContrato');
const { useParams, notFound } = require('next/navigation');

describe('Editar Contrato Page', () => {
  const mockAluno = { id: 1, nome: 'Aluno 1' };
  const mockProfessores = [
    { id: 1, nome: 'Professor 1' },
    { id: 2, nome: 'Professor 2' },
  ];
  const mockContrato = {
    id: 1,
    idAluno: 1,
    numero: 'CONT-001',
    valor: 1000,
    dataInicio: '2024-01-01',
    dataTermino: '2024-12-31',
    status: 'ATIVO',
    idioma: 'ENGLISH',
    aulas: [
      { id: 1, idProfessor: 1, dataAula: '2024-01-15T10:00:00Z' },
      { id: 2, idProfessor: 2, dataAula: '2024-01-20T14:00:00Z' },
    ],
    diaAulas: [{ diaSemana: 'SEGUNDA', ativo: true }],
  };

  const mockSetFormData = jest.fn();
  const mockSetInitialDiasAulas = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAlunosHook.mockReturnValue({
      alunos: [mockAluno],
      alunoOptions: [{ value: 1, label: 'Aluno 1' }],
    });

    useProfessoresHook.mockReturnValue({
      professores: mockProfessores,
      professorOptions: [
        { value: 1, label: 'Professor 1' },
        { value: 2, label: 'Professor 2' },
      ],
    });

    useFormaterHook.mockReturnValue({
      dataFormatter: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('pt-BR');
      }),
      formatForInput: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
      }),
    });

    useGenerateAulasByContratoHook.mockReturnValue({
      generateAulasByContrato: jest.fn(),
      isSubmitting: false,
    });

    useContratoFormHook.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: mockSetFormData,
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDuracaoAulaChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setInitialDiasAulas: mockSetInitialDiasAulas,
    });

    useEditarContratoHook.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockContrato,
      isNotFound: false,
      submit: jest.fn(),
    });
  });

  describe('Page Rendering', () => {
    it('renders editar contrato page with loading state', () => {
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: true,
        current: null,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });

    it('renders editar contrato form when contrato is loaded', () => {
      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
      expect(useContratoFormHook).toHaveBeenCalled();
    });
  });

  describe('Data Initialization', () => {
    it('initializes form data from current contrato', async () => {
      render(<EditarContrato />);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith(
          expect.objectContaining({
            alunoId: mockContrato.idAluno,
            aluno: mockAluno,
            dataInicio: useFormaterHook().formatForInput(
              mockContrato.dataInicio
            ),
            dataTermino: useFormaterHook().formatForInput(
              mockContrato.dataTermino
            ),
            status: mockContrato.status,
            idioma: mockContrato.idioma,
          })
        );
      });
    });

    it('extracts professorId from last aula when aulas exist', async () => {
      render(<EditarContrato />);

      await waitFor(() => {
        const formDataCall = mockSetFormData.mock.calls[0][0];
        expect(formDataCall.professorId).toBe(2);
      });
    });

    it('uses formData professor when no aulas exist', async () => {
      const contratoWithoutAulas = { ...mockContrato, aulas: [] };
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: contratoWithoutAulas,
        isNotFound: false,
        submit: jest.fn(),
      });

      useContratoFormHook.mockReturnValue({
        formData: { professorId: 1 },
        handleChange: jest.fn(),
        handleSubmit: jest.fn(),
        setFormData: mockSetFormData,
        handleAlunoChange: jest.fn(),
        handleProfessorChange: jest.fn(),
        handleAtivoChange: jest.fn(),
        handleHoraInicialChange: jest.fn(),
        handleQuantidadeAulasChange: jest.fn(),
        handleDuracaoAulaChange: jest.fn(),
        handleDeleteAula: jest.fn(),
        handleEditAula: jest.fn(),
        createAula: jest.fn(),
        setInitialDiasAulas: mockSetInitialDiasAulas,
      });

      render(<EditarContrato />);

      await waitFor(() => {
        expect(mockSetInitialDiasAulas).toHaveBeenCalledWith(
          contratoWithoutAulas.diaAulas
        );
      });
    });

    it('calls setInitialDiasAulas with diaAulas from contrato', async () => {
      render(<EditarContrato />);

      await waitFor(() => {
        expect(mockSetInitialDiasAulas).toHaveBeenCalledWith(
          mockContrato.diaAulas
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('calls notFound when isNotFound is true', () => {
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: null,
        isNotFound: true,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(notFound).toHaveBeenCalled();
    });

    it('does not call notFound when isNotFound is false', () => {
      render(<EditarContrato />);
      expect(notFound).not.toHaveBeenCalled();
    });

    it('renders with error messages when provided', () => {
      const errorMessages = ['Erro ao salvar', 'Dados inválidos'];
      useEditarContratoHook.mockReturnValue({
        message: 'Falha na operação',
        errors: errorMessages,
        isLoading: false,
        current: mockContrato,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple aulas with different professors', async () => {
      const multiProfectorAulas = [
        { id: 1, idProfessor: 1 },
        { id: 2, idProfessor: 2 },
        { id: 3, idProfessor: 1 },
      ];
      const contratoWithMultipleAulas = {
        ...mockContrato,
        aulas: multiProfectorAulas,
      };
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: contratoWithMultipleAulas,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);

      await waitFor(() => {
        const formDataCall = mockSetFormData.mock.calls[0][0];
        expect(formDataCall.professorId).toBe(1);
      });
    });

    it('handles contrato with no aulas gracefully', async () => {
      const contratoNoAulas = { ...mockContrato, aulas: [] };
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: contratoNoAulas,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });

    it('handles contrato with non-existent aluno ID', async () => {
      const contratoInvalidAluno = {
        ...mockContrato,
        idAluno: 999,
      };
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: contratoInvalidAluno,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });

    it('handles null current gracefully', async () => {
      useEditarContratoHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: null,
        isNotFound: false,
        submit: jest.fn(),
      });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });

    it('handles different contrato ID from params', () => {
      useParams.mockReturnValue({ id: '999' });

      render(<EditarContrato />);
      expect(useEditarContratoHook).toHaveBeenCalled();
    });
  });
});
