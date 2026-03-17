import { renderHook, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useAula } from './useAula';
import { getAula } from '@/store/slices/aulasSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@/store/slices/aulasSlice', () => ({
  getAula: jest.fn(id => ({ type: 'getAula', payload: id })),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  jest.clearAllMocks();
});

describe('useAula', () => {
  it('should dispatch getAula on mount when id is provided', () => {
    useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          current: null,
          message: null,
          status: STATUS.IDLE,
          statusError: null,
          action: 'getAula',
        },
      })
    );

    renderHook(() => useAula(123));

    expect(mockDispatch).toHaveBeenCalledWith(getAula(123));
  });

  it('should not dispatch getAula when id is not provided', () => {
    useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          current: null,
          message: null,
          status: STATUS.IDLE,
          statusError: null,
          action: 'getAula',
        },
      })
    );

    renderHook(() => useAula(null));

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should re-dispatch getAula when id changes', () => {
    useSelector.mockImplementation(cb =>
      cb({
        aulas: {
          current: null,
          message: null,
          status: STATUS.IDLE,
          statusError: null,
          action: 'getAula',
        },
      })
    );

    const { rerender } = renderHook(({ id }) => useAula(id), {
      initialProps: { id: 123 },
    });

    expect(mockDispatch).toHaveBeenCalledWith(getAula(123));
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    rerender({ id: 456 });

    expect(mockDispatch).toHaveBeenCalledWith(getAula(456));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  describe('loading state', () => {
    it('should return isLoading true when status is IDLE', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.IDLE,
            statusError: null,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isFailed).toBe(false);
      expect(result.current.isNotFound).toBe(false);
    });

    it('should return isLoading true when status is LOADING', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.LOADING,
            statusError: null,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isFailed).toBe(false);
      expect(result.current.isNotFound).toBe(false);
    });
  });

  describe('success state', () => {
    const mockAula = {
      id: 1,
      descricao: 'Aula de Português',
      aluno: { id: 10, nome: 'João' },
      professor: { id: 20, nome: 'Maria' },
      contrato: { id: 30, status: 'ativo' },
    };

    it('should return isSuccess true and aula data when status is SUCCESS', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: mockAula,
            message: null,
            status: STATUS.SUCCESS,
            statusError: null,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(1));

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFailed).toBe(false);
      expect(result.current.isNotFound).toBe(false);
      expect(result.current.aula).toEqual(mockAula);
    });

    it('should return aluno, professor, and contrato from current aula', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: mockAula,
            message: null,
            status: STATUS.SUCCESS,
            statusError: null,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(1));

      expect(result.current.aluno).toEqual(mockAula.aluno);
      expect(result.current.professor).toEqual(mockAula.professor);
      expect(result.current.contrato).toEqual(mockAula.contrato);
    });

    it('should return empty objects when current is null', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.SUCCESS,
            statusError: null,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(1));

      expect(result.current.aluno).toEqual({});
      expect(result.current.professor).toEqual({});
      expect(result.current.contrato).toEqual({});
      expect(result.current.aula).toEqual({});
    });
  });

  describe('failed state', () => {
    it('should return isFailed true when status is FAILED', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: 'Erro ao buscar aula',
            status: STATUS.FAILED,
            statusError: STATUS_ERROR.INTERNAL_SERVER_ERROR,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isFailed).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isNotFound).toBe(false);
      expect(result.current.message).toBe('Erro ao buscar aula');
    });
  });

  describe('not found state', () => {
    it('should return isNotFound true when statusError is NOT_FOUND', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.FAILED,
            statusError: STATUS_ERROR.NOT_FOUND,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isNotFound).toBe(true);
      expect(result.current.isFailed).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should return isNotFound true when statusError is BAD_REQUEST', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.FAILED,
            statusError: STATUS_ERROR.BAD_REQUEST,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isNotFound).toBe(true);
    });

    it('should not return isNotFound when current has data', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: { id: 1 },
            message: null,
            status: STATUS.FAILED,
            statusError: STATUS_ERROR.NOT_FOUND,
            action: 'getAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isNotFound).toBe(false);
    });

    it('should not return isNotFound when action is not getAula', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.FAILED,
            statusError: STATUS_ERROR.NOT_FOUND,
            action: 'otherAction',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isNotFound).toBe(false);
    });
  });

  describe('action validation', () => {
    it('should only consider isLoading, isSuccess, isFailed if action is getAula', () => {
      useSelector.mockImplementation(cb =>
        cb({
          aulas: {
            current: null,
            message: null,
            status: STATUS.LOADING,
            statusError: null,
            action: 'updateAula',
          },
        })
      );

      const { result } = renderHook(() => useAula(123));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isFailed).toBe(false);
    });
  });
});
