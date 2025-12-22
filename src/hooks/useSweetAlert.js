import { useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';

/**
 * Hook customizado para usar SweetAlert2 com configurações pré-definidas
 * @returns {Object} Objeto com métodos para diferentes tipos de alertas
 */
export const useSweetAlert = () => {
  // Configuração base para todos os alertas
  const baseConfig = useMemo(
    () => ({
      confirmButtonColor: '#3b82f6', // azul
      cancelButtonColor: '#ef4444', // vermelho
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md font-medium',
        cancelButton: 'px-4 py-2 rounded-md font-medium',
      },
    }),
    []
  );

  // Alert de sucesso
  const showSuccess = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'success',
        title: 'Sucesso!',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert de erro
  const showError = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'error',
        title: 'Erro!',
        confirmButtonText: 'OK',
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert de aviso
  const showWarning = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'warning',
        title: 'Atenção!',
        confirmButtonText: 'OK',
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert de informação
  const showInfo = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'info',
        title: 'Informação',
        confirmButtonText: 'OK',
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert de confirmação
  const showConfirm = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'question',
        title: 'Confirmar ação?',
        text: 'Esta ação não pode ser desfeita.',
        showCancelButton: true,
        confirmButtonText: 'Sim, confirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert de loading
  const showLoading = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        title: 'Carregando...',
        text: 'Por favor, aguarde.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert personalizado com input
  const showInput = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        title: 'Digite um valor',
        input: 'text',
        inputPlaceholder: 'Digite aqui...',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        inputValidator: value => {
          if (!value) {
            return 'Você precisa digitar algo!';
          }
        },
        ...options,
      });
    },
    [baseConfig]
  );

  // Alert para deletar com confirmação
  const showDeleteConfirm = useCallback(
    (itemName = 'este item', options = {}) => {
      return Swal.fire({
        ...baseConfig,
        icon: 'warning',
        title: 'Tem certeza?',
        text: `Você não poderá recuperar ${itemName} depois!`,
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        ...options,
      });
    },
    [baseConfig]
  );

  // Fechar alert programaticamente
  const close = useCallback(() => {
    Swal.close();
  }, []);

  // Toast (notificação leve)
  const showToast = useCallback((options = {}) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    return Toast.fire({
      icon: 'success',
      title: 'Operação realizada com sucesso!',
      ...options,
    });
  }, []);

  // Alert com formulário de múltiplos campos
  const showForm = useCallback(
    (options = {}) => {
      return Swal.fire({
        ...baseConfig,
        title: options.title || 'Preencha os campos',
        html: options.html || '',
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText || 'Confirmar',
        cancelButtonText: options.cancelButtonText || 'Cancelar',
        focusConfirm: false,
        preConfirm: options.preConfirm || (() => ({})),
        ...options,
      });
    },
    [baseConfig]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showLoading,
    showInput,
    showDeleteConfirm,
    showToast,
    showForm,
    close,
    // Acesso direto ao Swal para casos especiais
    Swal,
  };
};

export default useSweetAlert;
