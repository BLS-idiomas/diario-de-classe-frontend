import Swal from 'sweetalert2';
import { SweetAlertUtils } from './sweetAlert';

// Mock do SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  mixin: jest.fn(),
  close: jest.fn(),
  showLoading: jest.fn(),
  stopTimer: jest.fn(),
  resumeTimer: jest.fn(),
}));

describe('SweetAlertUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('baseConfig', () => {
    it('should use consistent base configuration across all methods', () => {
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

      SweetAlertUtils.success();

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining(expectedBaseConfig)
      );
    });
  });

  describe('success', () => {
    it('should call Swal.fire with correct success configuration', () => {
      SweetAlertUtils.success();

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
      const customOptions = {
        title: 'Operação concluída!',
        text: 'Dados salvos com sucesso',
        timer: 5000,
      };

      SweetAlertUtils.success(customOptions);

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
      const mockResult = { isConfirmed: true };
      Swal.fire.mockResolvedValue(mockResult);

      const result = await SweetAlertUtils.success();

      expect(result).toEqual(mockResult);
    });
  });

  describe('error', () => {
    it('should call Swal.fire with correct error configuration', () => {
      SweetAlertUtils.error();

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Erro!',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const customOptions = {
        title: 'Falha na operação',
        text: 'Erro ao conectar com o servidor',
      };

      SweetAlertUtils.error(customOptions);

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

  describe('warning', () => {
    it('should call Swal.fire with correct warning configuration', () => {
      SweetAlertUtils.warning();

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Atenção!',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const customOptions = {
        title: 'Dados incompletos',
        text: 'Preencha todos os campos obrigatórios',
      };

      SweetAlertUtils.warning(customOptions);

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

  describe('info', () => {
    it('should call Swal.fire with correct info configuration', () => {
      SweetAlertUtils.info();

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'info',
          title: 'Informação',
          confirmButtonText: 'OK',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const customOptions = {
        title: 'Nova funcionalidade',
        text: 'Agora você pode exportar relatórios em PDF',
      };

      SweetAlertUtils.info(customOptions);

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

  describe('confirm', () => {
    it('should call Swal.fire with correct confirm configuration', () => {
      SweetAlertUtils.confirm();

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
      const customOptions = {
        title: 'Salvar alterações?',
        text: 'As alterações serão aplicadas permanentemente',
        confirmButtonText: 'Salvar',
      };

      SweetAlertUtils.confirm(customOptions);

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

  describe('deleteConfirm', () => {
    it('should call Swal.fire with correct delete confirmation configuration', () => {
      SweetAlertUtils.deleteConfirm();

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
      SweetAlertUtils.deleteConfirm('este usuário');

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Você não poderá recuperar este usuário depois!',
        })
      );
    });

    it('should merge custom options with default configuration', () => {
      const customOptions = {
        title: 'Excluir permanentemente?',
        confirmButtonText: 'Sim, excluir!',
      };

      SweetAlertUtils.deleteConfirm('este registro', customOptions);

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

  describe('loading', () => {
    it('should call Swal.fire with correct loading configuration', () => {
      const mockDidOpen = jest.fn();

      SweetAlertUtils.loading();

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
      const customOptions = {
        title: 'Processando...',
        text: 'Enviando dados para o servidor',
      };

      SweetAlertUtils.loading(customOptions);

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

  describe('toast', () => {
    const mockToast = {
      fire: jest.fn(),
      addEventListener: jest.fn(),
    };

    beforeEach(() => {
      Swal.mixin.mockReturnValue(mockToast);
    });

    it('should create toast with correct mixin configuration', () => {
      SweetAlertUtils.toast();

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
      SweetAlertUtils.toast();

      expect(mockToast.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Operação realizada com sucesso!',
      });
    });

    it('should merge custom options with default toast configuration', () => {
      const customOptions = {
        icon: 'info',
        title: 'Dados atualizados!',
      };

      SweetAlertUtils.toast(customOptions);

      expect(mockToast.fire).toHaveBeenCalledWith({
        icon: 'info',
        title: 'Dados atualizados!',
      });
    });

    it('should setup mouse event listeners in didOpen callback', () => {
      SweetAlertUtils.toast();

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
      const mockResult = { isConfirmed: false };
      mockToast.fire.mockReturnValue(mockResult);

      const result = SweetAlertUtils.toast();

      expect(result).toBe(mockResult);
    });
  });

  describe('close', () => {
    it('should call Swal.close', () => {
      SweetAlertUtils.close();

      expect(Swal.close).toHaveBeenCalled();
    });

    it('should return the result from Swal.close', () => {
      const mockResult = true;
      Swal.close.mockReturnValue(mockResult);

      const result = SweetAlertUtils.close();

      expect(result).toBe(mockResult);
    });
  });

  describe('Swal property', () => {
    it('should expose the original Swal object', () => {
      expect(SweetAlertUtils.Swal).toBe(Swal);
    });
  });

  describe('integration tests', () => {
    it('should handle promise resolution correctly', async () => {
      const mockResult = { isConfirmed: true, value: 'test' };
      Swal.fire.mockResolvedValue(mockResult);

      const result = await SweetAlertUtils.success();

      expect(result).toEqual(mockResult);
    });

    it('should handle promise rejection correctly', async () => {
      const mockError = new Error('SweetAlert error');
      Swal.fire.mockRejectedValue(mockError);

      await expect(SweetAlertUtils.error()).rejects.toThrow('SweetAlert error');
    });

    it('should maintain method chaining', () => {
      const methods = [
        'success',
        'error',
        'warning',
        'info',
        'confirm',
        'deleteConfirm',
        'loading',
        'toast',
      ];

      methods.forEach(method => {
        expect(typeof SweetAlertUtils[method]).toBe('function');
      });

      expect(typeof SweetAlertUtils.close).toBe('function');
      expect(SweetAlertUtils.Swal).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined options gracefully', () => {
      SweetAlertUtils.success(undefined);

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'success',
          title: 'Sucesso!',
        })
      );
    });

    it('should handle null options gracefully', () => {
      SweetAlertUtils.error(null);

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Erro!',
        })
      );
    });

    it('should handle empty object options', () => {
      SweetAlertUtils.warning({});

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'warning',
          title: 'Atenção!',
        })
      );
    });

    it('should override base config when custom options conflict', () => {
      const customOptions = {
        confirmButtonColor: '#000000',
        icon: 'error', // This should override the success icon
      };

      SweetAlertUtils.success(customOptions);

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmButtonColor: '#000000',
          icon: 'error',
        })
      );
    });
  });
});
