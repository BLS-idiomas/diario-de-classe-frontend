import { render } from '@testing-library/react';
import EditarContrato from './page';
import { useEditarContrato } from '@/hooks/contratos/useEditarContrato';
import { STATUS_ERROR } from '@/constants/statusError';

jest.mock('@/hooks/contratos/useEditarContrato');
jest.mock('@/hooks/contratos/useContratoForm');
jest.mock('@/hooks/aulas/useAulasList');
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

describe('Editar Contrato Page', () => {
  let notFound;
  let useParams;

  beforeAll(() => {
    ({ notFound, useParams } = require('next/navigation'));
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useAlunosHook.mockReturnValue({
      alunos: [{ id: 1, nome: 'Aluno 1' }],
      alunoOptions: [{ value: 1, label: 'Aluno 1' }],
    });

    useProfessoresHook.mockReturnValue({
      professores: [{ id: 1, nome: 'Professor 1' }],
      professorOptions: [{ value: 1, label: 'Professor 1' }],
    });

    useFormaterHook.mockReturnValue({
      dataFormatter: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
      }),
      formatForInput: jest.fn(date => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
      }),
    });

    useGenerateAulasByContratoHook.mockReturnValue({
      isLoading: false,
      error: null,
      generateAulas: jest.fn(),
    });

    useContratoFormHook.mockReturnValue({
      formData: { numero: 'CONT-001' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setInitialDiasAulas: jest.fn(),
    });

    useEditarContratoHook.mockReturnValue({
      contrato: { id: 1, numero: 'CONT-001', valor: 1000 },
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      statusError: null,
      current: {
        id: 1,
        numero: 'CONT-001',
        valor: 1000,
        aulas: [],
      },
      isNotFound: false,
      errors: [],
      message: null,
      submit: jest.fn(),
    });

    useContratoFormHook.mockReturnValue({
      formData: { numero: 'CONT-001' },
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setInitialDiasAulas: jest.fn(),
    });
  });

  it('renders editar contrato page', () => {
    render(<EditarContrato />);
    expect(useEditarContratoHook).toHaveBeenCalled();
  });

  it('calls notFound when contrato not found', () => {
    useEditarContratoHook.mockReturnValue({
      contrato: null,
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      isLoading: false,
      statusError: null,
      current: null,
      isNotFound: true,
      errors: [],
      message: null,
      submit: jest.fn(),
    });

    useContratoFormHook.mockReturnValue({
      formData: {},
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      setFormData: jest.fn(),
      handleAlunoChange: jest.fn(),
      handleProfessorChange: jest.fn(),
      handleAtivoChange: jest.fn(),
      handleHoraInicialChange: jest.fn(),
      handleQuantidadeAulasChange: jest.fn(),
      handleDeleteAula: jest.fn(),
      handleEditAula: jest.fn(),
      createAula: jest.fn(),
      setInitialDiasAulas: jest.fn(),
    });

    render(<EditarContrato />);
    expect(notFound).toHaveBeenCalled();
  });
});
