import { renderHook, act } from '@testing-library/react';
import { useEditarDisponibilidadeProfessor } from './useEditarDisponibilidadeProfessor';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { STATUS } from '@/constants';
import {
  updateDisponibilidadeProfessor,
  clearStatus,
  clearCurrent,
} from '@/store/slices/professoresSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/providers/ToastProvider', () => ({
  useToast: jest.fn(),
}));
jest.mock('@/store/slices/professoresSlice', () => ({
  updateDisponibilidadeProfessor: jest.fn(payload => ({
    type: 'updateDisponibilidadeProfessor',
    payload,
  })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

describe('useEditarDisponibilidadeProfessor', () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();
  const mockSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useRouter.mockReturnValue({ push: mockPush });
    useToast.mockReturnValue({ success: mockSuccess });
  });

  it('deve retornar estados e funções corretamente', () => {
    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          status: STATUS.IDLE,
          message: 'msg',
          errors: [],
          action: '',
        },
      })
    );
    const { result } = renderHook(() => useEditarDisponibilidadeProfessor(123));
    expect(result.current.message).toBe('msg');
    expect(result.current.errors).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(true);
    expect(typeof result.current.submit).toBe('function');
  });

  it('deve disparar updateDisponibilidadeProfessor no submit', () => {
    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          status: STATUS.IDLE,
          message: '',
          errors: [],
          action: '',
        },
      })
    );
    const { result } = renderHook(() => useEditarDisponibilidadeProfessor(123));
    act(() => {
      result.current.submit({ id: 123, dataToSend: { dias: ['segunda'] } });
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      updateDisponibilidadeProfessor({ id: 123, data: { dias: ['segunda'] } })
    );
  });

  it('deve disparar clearCurrent, clearStatus, success e router.push quando status for SUCCESS e action correto', () => {
    useSelector.mockImplementation(fn =>
      fn({
        professores: {
          status: STATUS.SUCCESS,
          message: '',
          errors: [],
          action: 'updateDisponibilidadeProfessor',
        },
      })
    );
    renderHook(() => useEditarDisponibilidadeProfessor(456));
    expect(mockDispatch).toHaveBeenCalledWith(clearCurrent());
    expect(mockDispatch).toHaveBeenCalledWith(clearStatus());
    expect(mockSuccess).toHaveBeenCalledWith('Operação realizada com sucesso!');
    expect(mockPush).toHaveBeenCalledWith('/professores/456');
  });
});
