import { renderHook, act, waitFor } from '@testing-library/react';
import { useEditarDisponibilidadeProfessor } from './useEditarDisponibilidadeProfessor';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/providers/ToastProvider';
import { STATUS } from '@/constants';
import {
  updateDisponibilidadeProfessor,
  clearStatus,
} from '@/store/slices/professoresSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
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
}));

describe('useEditarDisponibilidadeProfessor', () => {
  const mockDispatch = jest.fn();
  const mockSuccess = jest.fn();
  const mockProfessor = { id: 123, nome: 'Professor Teste' };

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useToast.mockReturnValue({ success: mockSuccess });
  });

  describe('initial state', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );
      expect(result.current.message).toBe('msg');
      expect(result.current.errors).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.editMode).toBe(false);
      expect(result.current.formData).toBeDefined();
      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleCheckboxChange).toBe('function');
      expect(typeof result.current.setDisponibilidadesHandle).toBe('function');
      expect(typeof result.current.setEditMode).toBe('function');
    });

    it('deve inicializar formData com todos os dias da semana', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );
      const dias = [
        'SEGUNDA',
        'TERCA',
        'QUARTA',
        'QUINTA',
        'SEXTA',
        'SABADO',
        'DOMINGO',
      ];
      dias.forEach(dia => {
        expect(result.current.formData[dia]).toBeDefined();
        expect(result.current.formData[dia].diaSemana).toBe(dia);
        expect(result.current.formData[dia].id).toBeNull();
        expect(result.current.formData[dia].horaInicial).toBeNull();
        expect(result.current.formData[dia].horaFinal).toBeNull();
        expect(result.current.formData[dia].ativo).toBeNull();
        expect(result.current.formData[dia].userId).toBeNull();
      });
    });

    it('deve definir isLoading como true quando status for LOADING', () => {
      useSelector.mockImplementation(fn =>
        fn({
          professores: {
            status: STATUS.LOADING,
            message: '',
            errors: [],
            action: '',
          },
        })
      );
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('setDisponibilidadesHandle', () => {
    it('deve atualizar formData com disponibilidades fornecidas', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      const disponibilidades = [
        {
          id: 1,
          diaSemana: 'SEGUNDA',
          horaInicial: '08:00',
          horaFinal: '12:00',
          ativo: true,
          userId: 123,
        },
        {
          id: 2,
          diaSemana: 'QUARTA',
          horaInicial: '14:00',
          horaFinal: '18:00',
          ativo: true,
          userId: 123,
        },
      ];

      act(() => {
        result.current.setDisponibilidadesHandle(disponibilidades);
      });

      expect(result.current.formData.SEGUNDA.id).toBe(1);
      expect(result.current.formData.SEGUNDA.horaInicial).toBe('08:00');
      expect(result.current.formData.SEGUNDA.horaFinal).toBe('12:00');
      expect(result.current.formData.SEGUNDA.ativo).toBe(true);
      expect(result.current.formData.QUARTA.id).toBe(2);
      expect(result.current.formData.TERCA.id).toBeUndefined();
    });

    it('deve manter dias sem disponibilidade com valores vazios', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      act(() => {
        result.current.setDisponibilidadesHandle([]);
      });

      expect(result.current.formData.SEGUNDA.id).toBeUndefined();
      expect(result.current.formData.SEGUNDA.diaSemana).toBe('SEGUNDA');
    });
  });

  describe('handleChange', () => {
    it('deve atualizar campo específico no formData', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      const event = {
        target: {
          name: 'SEGUNDA.horaInicial',
          value: '09:00',
        },
      };

      act(() => {
        result.current.handleChange(event);
      });

      expect(result.current.formData.SEGUNDA.horaInicial).toBe('09:00');
    });

    it('deve atualizar múltiplos campos independentemente', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'SEGUNDA.horaInicial', value: '08:00' },
        });
        result.current.handleChange({
          target: { name: 'SEGUNDA.horaFinal', value: '12:00' },
        });
        result.current.handleChange({
          target: { name: 'TERCA.horaInicial', value: '14:00' },
        });
      });

      expect(result.current.formData.SEGUNDA.horaInicial).toBe('08:00');
      expect(result.current.formData.SEGUNDA.horaFinal).toBe('12:00');
      expect(result.current.formData.TERCA.horaInicial).toBe('14:00');
    });
  });

  describe('handleCheckboxChange', () => {
    it('deve atualizar campo checkbox no formData', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      const event = {
        target: {
          name: 'SEGUNDA.ativo',
          checked: true,
        },
      };

      act(() => {
        result.current.handleCheckboxChange(event);
      });

      expect(result.current.formData.SEGUNDA.ativo).toBe(true);
    });

    it('deve alternar valor do checkbox', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      act(() => {
        result.current.handleCheckboxChange({
          target: { name: 'QUARTA.ativo', checked: true },
        });
      });
      expect(result.current.formData.QUARTA.ativo).toBe(true);

      act(() => {
        result.current.handleCheckboxChange({
          target: { name: 'QUARTA.ativo', checked: false },
        });
      });
      expect(result.current.formData.QUARTA.ativo).toBe(false);
    });
  });

  describe('handleSubmit', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      const mockEvent = { preventDefault: jest.fn() };

      act(() => {
        result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(
        updateDisponibilidadeProfessor({
          id: 123,
          data: expect.any(Array),
        })
      );
    });

    it('deve enviar todos os dados do formData como array', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      act(() => {
        result.current.handleChange({
          target: { name: 'SEGUNDA.horaInicial', value: '08:00' },
        });
      });

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      const dispatchCall = mockDispatch.mock.calls[0][0];
      expect(dispatchCall.payload.data).toHaveLength(7); // 7 dias da semana
      expect(Array.isArray(dispatchCall.payload.data)).toBe(true);
    });
  });

  describe('editMode', () => {
    it('deve permitir alternar editMode', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      expect(result.current.editMode).toBe(false);

      act(() => {
        result.current.setEditMode(true);
      });

      expect(result.current.editMode).toBe(true);

      act(() => {
        result.current.setEditMode(false);
      });

      expect(result.current.editMode).toBe(false);
    });
  });

  describe('success effect', () => {
    it('deve disparar clearStatus, success e setEditMode(false) quando status for SUCCESS', async () => {
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

      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      expect(mockDispatch).toHaveBeenCalledWith(clearStatus());
      expect(mockSuccess).toHaveBeenCalledWith(
        'Operação realizada com sucesso!'
      );

      // Aguarda o queueMicrotask executar
      await waitFor(() => {
        expect(result.current.editMode).toBe(false);
      });
    });

    it('não deve disparar ações quando action não for updateDisponibilidadeProfessor', () => {
      useSelector.mockImplementation(fn =>
        fn({
          professores: {
            status: STATUS.SUCCESS,
            message: '',
            errors: [],
            action: 'outraAction',
          },
        })
      );

      renderHook(() => useEditarDisponibilidadeProfessor(mockProfessor));

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSuccess).not.toHaveBeenCalled();
    });

    it('não deve disparar ações quando status não for SUCCESS', () => {
      useSelector.mockImplementation(fn =>
        fn({
          professores: {
            status: STATUS.IDLE,
            message: '',
            errors: [],
            action: 'updateDisponibilidadeProfessor',
          },
        })
      );

      renderHook(() => useEditarDisponibilidadeProfessor(mockProfessor));

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockSuccess).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('deve lidar com professor sem id', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor({})
      );

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        updateDisponibilidadeProfessor({
          id: undefined,
          data: expect.any(Array),
        })
      );
    });

    it('deve lidar com formData vazio', () => {
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
      const { result } = renderHook(() =>
        useEditarDisponibilidadeProfessor(mockProfessor)
      );

      act(() => {
        result.current.setFormData({});
      });

      act(() => {
        result.current.handleSubmit({ preventDefault: jest.fn() });
      });

      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
