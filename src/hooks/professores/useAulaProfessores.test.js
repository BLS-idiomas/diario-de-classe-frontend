import { renderHook } from '@testing-library/react';
import { useAulaProfessores } from './useAulaProfessores';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulasProfessor } from '@/store/slices/professoresSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/professoresSlice', () => ({
  getAulasProfessor: jest.fn(id => ({
    type: 'getAulasProfessor',
    payload: id,
  })),
}));

describe('useAulaProfessores', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  it('deve retornar aulas e status corretamente', () => {
    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          aulas: ['Aula1'],
          status: STATUS.SUCCESS,
          action: 'getAulasProfessor',
        },
      })
    );
    const { result } = renderHook(() => useAulaProfessores(123));
    expect(result.current.aulas).toEqual(['Aula1']);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });

  it('deve disparar getAulasProfessor quando id é fornecido', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { aulas: [], status: STATUS.IDLE } })
    );
    renderHook(() => useAulaProfessores(456));
    expect(mockDispatch).toHaveBeenCalledWith(getAulasProfessor(456));
  });

  it('não dispara getAulasProfessor quando id é undefined', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { aulas: [], status: STATUS.IDLE } })
    );
    renderHook(() => useAulaProfessores(undefined));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('deve retornar isLoading, isSuccess e isFailed corretamente', () => {
    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          aulas: [],
          status: STATUS.LOADING,
          action: 'getAulasProfessor',
        },
      })
    );
    let { result, rerender } = renderHook(() => useAulaProfessores(1));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(false);

    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          aulas: [],
          status: STATUS.FAILED,
          action: 'getAulasProfessor',
        },
      })
    );
    rerender();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(true);
  });
});
