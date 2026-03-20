import { render, waitFor } from '@testing-library/react';
import EditarAula from './page';
import { useEditarAula } from '@/hooks/aulas/useEditarAula';
import { STATUS_ERROR } from '@/constants/statusError';
import { calculateDuracaoAula } from '@/utils/calculateDuracaoAula';

jest.mock('@/hooks/aulas/useEditarAula');
jest.mock('@/hooks/aulas/useAulaForm');
jest.mock('@/components');
jest.mock('@/utils/calculateDuracaoAula');

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ id: '1' })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null),
  })),
  notFound: jest.fn(),
}));

const {
  useEditarAula: useEditarAulaHook,
} = require('@/hooks/aulas/useEditarAula');
const { useAulaForm: useAulaFormHook } = require('@/hooks/aulas/useAulaForm');
const { useParams, useSearchParams, notFound } = require('next/navigation');

describe('Editar Aula Page', () => {
  const mockAula = {
    id: 1,
    titulo: 'Aula 1',
    dataAula: '2024-01-15T10:00:00Z',
    horaInicial: '10:00',
    horaFinal: '10:40',
    duracaoAula: 40,
    idContrato: 1,
    idAluno: 1,
    idProfessor: 1,
  };

  const mockSetFormData = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    calculateDuracaoAula.mockReturnValue(40);

    useEditarAulaHook.mockReturnValue({
      message: null,
      errors: [],
      isLoading: false,
      current: mockAula,
      statusError: null,
      submit: mockSubmit,
    });

    useAulaFormHook.mockReturnValue({
      formData: mockAula,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      setFormData: mockSetFormData,
    });
  });

  describe('Page Rendering', () => {
    it('renders editar aula page with loading state when no current aula', () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: true,
        current: null,
        statusError: null,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });

    it('renders editar aula form when aula is loaded', () => {
      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
      expect(useAulaFormHook).toHaveBeenCalled();
    });
  });

  describe('Data Initialization', () => {
    it('initializes form data from current aula', async () => {
      render(<EditarAula />);

      await waitFor(() => {
        expect(mockSetFormData).toHaveBeenCalledWith(
          expect.objectContaining({
            dataAula: mockAula.dataAula.split('T')[0],
            duracaoAula: mockAula.duracaoAula,
          })
        );
      });
    });

    it('calculates duracao when missing from current aula', async () => {
      const aulaWithoutDuracao = { ...mockAula, duracaoAula: null };
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: aulaWithoutDuracao,
        statusError: null,
        submit: mockSubmit,
      });

      render(<EditarAula />);

      await waitFor(() => {
        expect(calculateDuracaoAula).toHaveBeenCalledWith(aulaWithoutDuracao);
      });
    });

    it('splits dataAula to remove time portion', async () => {
      render(<EditarAula />);

      await waitFor(() => {
        const callArgs = mockSetFormData.mock.calls[0][0];
        expect(callArgs.dataAula).toBe('2024-01-15');
        expect(callArgs.dataAula).not.toContain('T');
      });
    });
  });

  describe('Error Handling', () => {
    it('calls notFound when status is NOT_FOUND', () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: null,
        statusError: STATUS_ERROR.NOT_FOUND,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(notFound).toHaveBeenCalled();
    });

    it('calls notFound when status is BAD_REQUEST', () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: null,
        statusError: STATUS_ERROR.BAD_REQUEST,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(notFound).toHaveBeenCalled();
    });

    it('does not call notFound for other status errors', () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: mockAula,
        statusError: STATUS_ERROR.UNAUTHORIZED,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(notFound).not.toHaveBeenCalled();
    });
  });

  describe('Back URL Handling', () => {
    it('uses backUrl from search params when provided', () => {
      const backUrlValue = '/aulas/list';
      useSearchParams().get.mockReturnValue(backUrlValue);

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });

    it('uses default aula path when backUrl is null', () => {
      useSearchParams().get.mockReturnValue(null);

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles null current aula gracefully during init', async () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: null,
        statusError: null,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });

    it('handles aula with empty error list', () => {
      useEditarAulaHook.mockReturnValue({
        message: null,
        errors: [],
        isLoading: false,
        current: mockAula,
        statusError: null,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });

    it('handles aula with error messages', () => {
      const errorMessage = 'Erro ao salvar';
      useEditarAulaHook.mockReturnValue({
        message: errorMessage,
        errors: ['Erro 1'],
        isLoading: false,
        current: mockAula,
        statusError: null,
        submit: mockSubmit,
      });

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });

    it('handles different aula ID from params', () => {
      useParams.mockReturnValue({ id: '999' });

      render(<EditarAula />);
      expect(useEditarAulaHook).toHaveBeenCalled();
    });
  });
});
