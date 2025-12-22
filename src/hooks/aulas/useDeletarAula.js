import { useDispatch } from 'react-redux';
import { deleteAula } from '@/store/slices/aulasSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

export function useDeletarAula() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useSweetAlert();

  const handleDeleteAula = async id => {
    const resultAlert = await showConfirm({
      title: 'Confirmar exclusão?',
      text: 'O registro desse aula não pode ser recuperado!',
    });
    if (resultAlert.isConfirmed) {
      const result = await dispatch(deleteAula(id));
      if (result.error) {
        showError({
          title: 'Erro!',
          text: 'Não foi possível excluir o aula.',
        });
      } else {
        showSuccess({
          title: 'Confirmado!',
          text: 'Aula excluído com sucesso.',
        });
      }
    }
  };

  return {
    handleDeleteAula,
  };
}
