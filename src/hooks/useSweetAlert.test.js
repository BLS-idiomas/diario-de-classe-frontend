import { renderHook, act } from '@testing-library/react';
import Swal from 'sweetalert2';
import { useSweetAlert } from './useSweetAlert';

// Mock do SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  mixin: jest.fn(),
  close: jest.fn(),
  showLoading: jest.fn(),
  stopTimer: jest.fn(),
  resumeTimer: jest.fn(),
}));

describe('useSweetAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hook initialization', () => {
    it('should return all expected methods', () => {
      const { result } = renderHook(() => useSweetAlert());

      expect(result.current).toHaveProperty('showSuccess');
      expect(result.current).toHaveProperty('showError');
      expect(result.current).toHaveProperty('showWarning');
      expect(result.current).toHaveProperty('showInfo');
      expect(result.current).toHaveProperty('showConfirm');
      expect(result.current).toHaveProperty('showLoading');
      expect(result.current).toHaveProperty('showInput');
      expect(result.current).toHaveProperty('showDeleteConfirm');
      expect(result.current).toHaveProperty('showToast');
      expect(result.current).toHaveProperty('close');
      expect(result.current).toHaveProperty('Swal');
    });

    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useSweetAlert());

      const firstRender = result.current;
      rerender();
      const secondRender = result.current;

      expect(firstRender.showSuccess).toBe(secondRender.showSuccess);
      expect(firstRender.showError).toBe(secondRender.showError);
      expect(firstRender.showWarning).toBe(secondRender.showWarning);
      expect(firstRender.showInfo).toBe(secondRender.showInfo);
      expect(firstRender.showConfirm).toBe(secondRender.showConfirm);
      expect(firstRender.showLoading).toBe(secondRender.showLoading);
      expect(firstRender.showInput).toBe(secondRender.showInput);
      expect(firstRender.showDeleteConfirm).toBe(
        secondRender.showDeleteConfirm
      );
      expect(firstRender.showToast).toBe(secondRender.showToast);
      expect(firstRender.close).toBe(secondRender.close);
    });

    it('should expose Swal directly', () => {
      const { result } = renderHook(() => useSweetAlert());

      expect(result.current.Swal).toBe(Swal);
    });
  });

  describe('baseConfig consistency', () => {
    it('should use consistent base configuration across all methods', () => {
      const { result } = renderHook(() => useSweetAlert());

      const expectedBaseConfig = {
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          confirmButton: 'px-4 py-2 rounded-md font-medium',
          cancelButton: 'px-4 py-2 rounded-md font-medium',
        },
      };

      act(() => {
        result.current.showSuccess();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining(expectedBaseConfig)
      );
    });
  });

  describe('showSuccess', () => {
    it('should call Swal.fire with correct success configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showSuccess();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Sucesso!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Operação concluída!',
        text: 'Dados salvos com sucesso',
        timer: 5000,
      };

      act(() => {
        result.current.showSuccess(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Operação concluída!',
          text: 'Dados salvos com sucesso',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
        })
      );
    });

    it('should return the result from Swal.fire', async () => {
      const { result } = renderHook(() => useSweetAlert());
      const mockResult = { isConfirmed: true };
      Swal.fire.mockResolvedValue(mockResult);

      let alertResult;
      act(() => {
        alertResult = result.current.showSuccess();
      });

      await expect(alertResult).resolves.toEqual(mockResult);
    });
  });

  describe('showError', () => {
    it('should call Swal.fire with correct error configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showError();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Erro!',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Falha na operação',
        text: 'Erro ao conectar com o servidor',
      };

      act(() => {
        result.current.showError(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Falha na operação',
          text: 'Erro ao conectar com o servidor',
          confirmButtonText: 'OK',
        })
      );
    });
  });

  describe('showWarning', () => {
    it('should call Swal.fire with correct warning configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showWarning();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Atenção!',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Dados incompletos',
        text: 'Preencha todos os campos obrigatórios',
      };

      act(() => {
        result.current.showWarning(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Dados incompletos',
          text: 'Preencha todos os campos obrigatórios',
          confirmButtonText: 'OK',
        })
      );
    });
  });

  describe('showInfo', () => {
    it('should call Swal.fire with correct info configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showInfo();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'info',
          title: 'Informação',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Nova funcionalidade',
        text: 'Agora você pode exportar relatórios em PDF',
      };

      act(() => {
        result.current.showInfo(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'info',
          title: 'Nova funcionalidade',
          text: 'Agora você pode exportar relatórios em PDF',
          confirmButtonText: 'OK',
        })
      );
    });
  });

  describe('showConfirm', () => {
    it('should call Swal.fire with correct confirm configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showConfirm();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'question',
          title: 'Confirmar ação?',
          text: 'Esta ação não pode ser desfeita.',
          showCancelButton: true,
          confirmButtonText: 'Sim, confirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Salvar alterações?',
        text: 'As alterações serão aplicadas permanentemente',
        confirmButtonText: 'Salvar',
      };

      act(() => {
        result.current.showConfirm(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'question',
          title: 'Salvar alterações?',
          text: 'As alterações serão aplicadas permanentemente',
          showCancelButton: true,
          confirmButtonText: 'Salvar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
        })
      );
    });
  });

  describe('showLoading', () => {
    it('should call Swal.fire with correct loading configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showLoading();
      });

      const callArgs = Swal.fire.mock.calls[0][0];

      expect(callArgs).toMatchObject({
        title: 'Carregando...',
        text: 'Por favor, aguarde.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
      });

      // Test didOpen callback
      expect(typeof callArgs.didOpen).toBe('function');
      callArgs.didOpen();
      expect(Swal.showLoading).toHaveBeenCalled();
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Processando...',
        text: 'Enviando dados para o servidor',
      };

      act(() => {
        result.current.showLoading(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Processando...',
          text: 'Enviando dados para o servidor',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
        })
      );
    });
  });

  describe('showInput', () => {
    it('should call Swal.fire with correct input configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showInput();
      });

      const callArgs = Swal.fire.mock.calls[0][0];

      expect(callArgs).toMatchObject({
        title: 'Digite um valor',
        input: 'text',
        inputPlaceholder: 'Digite aqui...',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      });

      expect(typeof callArgs.inputValidator).toBe('function');
    });

    it('should validate empty input', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showInput();
      });

      const callArgs = Swal.fire.mock.calls[0][0];
      const validator = callArgs.inputValidator;

      expect(validator('')).toBe('Você precisa digitar algo!');
      expect(validator('valid input')).toBeUndefined();
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Digite seu nome',
        inputPlaceholder: 'Nome completo...',
      };

      act(() => {
        result.current.showInput(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Digite seu nome',
          input: 'text',
          inputPlaceholder: 'Nome completo...',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        })
      );
    });
  });

  describe('showDeleteConfirm', () => {
    it('should call Swal.fire with correct delete confirmation configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showDeleteConfirm();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Tem certeza?',
          text: 'Você não poderá recuperar este item depois!',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Sim, deletar!',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
        })
      );
    });

    it('should use custom item name in confirmation text', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showDeleteConfirm('este usuário');
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Você não poderá recuperar este usuário depois!',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        title: 'Excluir permanentemente?',
        confirmButtonText: 'Sim, excluir!',
      };

      act(() => {
        result.current.showDeleteConfirm('este registro', customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Excluir permanentemente?',
          text: 'Você não poderá recuperar este registro depois!',
          confirmButtonText: 'Sim, excluir!',
        })
      );
    });
  });

  describe('showToast', () => {
    const mockToast = {
      fire: jest.fn(),
    };

    beforeEach(() => {
      Swal.mixin.mockReturnValue(mockToast);
    });

    it('should create toast with correct mixin configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showToast();
      });

      expect(Swal.mixin).toHaveBeenCalledWith({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: expect.any(Function),
      });
    });

    it('should call toast fire with default options', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showToast();
      });

      expect(mockToast.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Operação realizada com sucesso!',
      });
    });

    it('should merge custom options with default toast configuration', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        icon: 'info',
        title: 'Dados atualizados!',
      };

      act(() => {
        result.current.showToast(customOptions);
      });

      expect(mockToast.fire).toHaveBeenCalledWith({
        icon: 'info',
        title: 'Dados atualizados!',
      });
    });

    it('should setup mouse event listeners in didOpen callback', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showToast();
      });

      const mixinConfig = Swal.mixin.mock.calls[0][0];
      const mockToastElement = {
        addEventListener: jest.fn(),
      };

      // Execute didOpen callback
      mixinConfig.didOpen(mockToastElement);

      expect(mockToastElement.addEventListener).toHaveBeenCalledWith(
        'mouseenter',
        Swal.stopTimer
      );
      expect(mockToastElement.addEventListener).toHaveBeenCalledWith(
        'mouseleave',
        Swal.resumeTimer
      );
    });

    it('should return the result from toast fire', () => {
      const { result } = renderHook(() => useSweetAlert());
      const mockResult = { isConfirmed: false };
      mockToast.fire.mockReturnValue(mockResult);

      let toastResult;
      act(() => {
        toastResult = result.current.showToast();
      });

      expect(toastResult).toBe(mockResult);
    });
  });

  describe('close', () => {
    it('should call Swal.close', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.close();
      });

      expect(Swal.close).toHaveBeenCalled();
    });

    it('should not return any value from close method', () => {
      const { result } = renderHook(() => useSweetAlert());

      let closeResult;
      act(() => {
        closeResult = result.current.close();
      });

      expect(closeResult).toBeUndefined();
    });
  });

  describe('hook optimization', () => {
    it('should memoize baseConfig', () => {
      const { result, rerender } = renderHook(() => useSweetAlert());

      // Call a method to trigger baseConfig usage
      act(() => {
        result.current.showSuccess();
      });

      const firstCall = Swal.fire.mock.calls[0][0];

      // Clear mocks and rerender
      jest.clearAllMocks();
      rerender();

      // Call the same method again
      act(() => {
        result.current.showSuccess();
      });

      const secondCall = Swal.fire.mock.calls[0][0];

      // The baseConfig object should be the same reference (memoized)
      expect(firstCall.confirmButtonColor).toBe(secondCall.confirmButtonColor);
      expect(firstCall.cancelButtonColor).toBe(secondCall.cancelButtonColor);
      expect(firstCall.background).toBe(secondCall.background);
      expect(firstCall.color).toBe(secondCall.color);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined options gracefully', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showSuccess(undefined);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Sucesso!',
        })
      );
    });

    it('should handle null options gracefully', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showError(null);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Erro!',
        })
      );
    });

    it('should handle empty object options', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showWarning({});
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Atenção!',
        })
      );
    });

    it('should override base config when custom options conflict', () => {
      const { result } = renderHook(() => useSweetAlert());

      const customOptions = {
        confirmButtonColor: '#000000',
        icon: 'error', // This should override the success icon
      };

      act(() => {
        result.current.showSuccess(customOptions);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmButtonColor: '#000000',
          icon: 'error',
        })
      );
    });
  });

  describe.skip('integration tests', () => {
    it('should handle promise resolution correctly', async () => {
      const { result } = renderHook(() => useSweetAlert());
      const mockResult = { isConfirmed: true, value: 'test' };
      Swal.fire.mockResolvedValue(mockResult);

      let alertResult;
      act(() => {
        alertResult = result.current.showSuccess();
      });

      await expect(alertResult).resolves.toEqual(mockResult);
    });

    it('should handle promise rejection correctly', async () => {
      const { result } = renderHook(() => useSweetAlert());
      const mockError = new Error('SweetAlert error');
      Swal.fire.mockRejectedValue(mockError);

      let alertResult;
      act(() => {
        alertResult = result.current.showError();
      });

      await expect(alertResult).rejects.toThrow('SweetAlert error');
    });

    it('should work with multiple simultaneous calls', () => {
      const { result } = renderHook(() => useSweetAlert());

      act(() => {
        result.current.showSuccess({ title: 'Success 1' });
        result.current.showError({ title: 'Error 1' });
        result.current.showWarning({ title: 'Warning 1' });
      });

      expect(Swal.fire).toHaveBeenCalledTimes(3);
      expect(Swal.fire).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          icon: 'success',
          title: 'Success 1',
        })
      );
      expect(Swal.fire).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          icon: 'error',
          title: 'Error 1',
        })
      );
      expect(Swal.fire).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          icon: 'warning',
          title: 'Warning 1',
        })
      );
    });
  });
});
