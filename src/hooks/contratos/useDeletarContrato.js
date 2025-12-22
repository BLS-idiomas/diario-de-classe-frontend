import { useDispatch } from 'react-redux';
import { deleteContrato } from '@/store/slices/contratosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

export function useDeletarContrato() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useSweetAlert();

  const handleDeleteContrato = async id => {
    const resultAlert = await showConfirm({
      title: 'Confirmar exclusão?',
      text: 'O registro desse contrato não pode ser recuperado!',
    });
    if (resultAlert.isConfirmed) {
      const result = await dispatch(deleteContrato(id));
      if (result.error) {
        showError({
          title: 'Erro!',
          text: 'Não foi possível excluir o contrato.',
        });
      } else {
        showSuccess({
          title: 'Confirmado!',
          text: 'Contrato excluído com sucesso.',
        });
      }
    }
  };

  return {
    handleDeleteContrato,
  };
}
