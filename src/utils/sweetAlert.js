import Swal from 'sweetalert2';

// Configuração global do SweetAlert2
const baseConfig = {
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

// Utilitários globais
export const SweetAlertUtils = {
  // Success
  success: (options = {}) => {
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

  // Error
  error: (options = {}) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'error',
      title: 'Erro!',
      confirmButtonText: 'OK',
      ...options,
    });
  },

  // Warning
  warning: (options = {}) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'warning',
      title: 'Atenção!',
      confirmButtonText: 'OK',
      ...options,
    });
  },

  // Info
  info: (options = {}) => {
    return Swal.fire({
      ...baseConfig,
      icon: 'info',
      title: 'Informação',
      confirmButtonText: 'OK',
      ...options,
    });
  },

  // Confirm
  confirm: (options = {}) => {
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

  // Delete confirmation
  deleteConfirm: (itemName = 'este item', options = {}) => {
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

  // Loading
  loading: (options = {}) => {
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

  // Toast
  toast: (options = {}) => {
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
  },

  // Close
  close: () => Swal.close(),

  // Acesso direto ao Swal
  Swal,
};

export default SweetAlertUtils;
