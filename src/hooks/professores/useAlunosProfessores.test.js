import { renderHook } from '@testing-library/react';
import { useAlunosProfessores } from './useAlunosProfessores';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAlunosProfessor } from '@/store/slices/professoresSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/store/slices/professoresSlice', () => ({
  getAlunosProfessor: jest.fn(id => ({
    type: 'getAlunosProfessor',
    payload: id,
  })),
}));

describe('useAlunosProfessores', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  it('deve retornar alunos e status corretamente', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { alunos: ['Aluno1'], status: STATUS.SUCCESS } })
    );
    const { result } = renderHook(() => useAlunosProfessores(123));
    expect(result.current.alunos).toEqual(['Aluno1']);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFailed).toBe(false);
  });

  it('deve disparar getAlunosProfessor quando id é fornecido', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { alunos: [], status: STATUS.IDLE } })
    );
    renderHook(() => useAlunosProfessores(456));
    expect(mockDispatch).toHaveBeenCalledWith(getAlunosProfessor(456));
  });

  it('não dispara getAlunosProfessor quando id é undefined', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { alunos: [], status: STATUS.IDLE } })
    );
    renderHook(() => useAlunosProfessores(undefined));
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('deve retornar isLoading, isSuccess e isFailed corretamente', () => {
    useSelector.mockImplementation(fn =>
      fn({ professores: { alunos: [], status: STATUS.LOADING } })
    );
    let { result, rerender } = renderHook(() => useAlunosProfessores(1));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(false);

    useSelector.mockImplementation(fn =>
      fn({ professores: { alunos: [], status: STATUS.FAILED } })
    );
    rerender();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isFailed).toBe(true);
  });
});
