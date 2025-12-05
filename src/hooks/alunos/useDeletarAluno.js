import { useDispatch } from 'react-redux';
import { deleteAluno } from '@/store/slices/alunosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

export function useDeletarAluno() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useSweetAlert();

  const handleDeleteAluno = async id => {
    const resultAlert = await showConfirm({
      title: 'Confirmar exclusão?',
      text: 'O registro desse aluno não pode ser recuperado!',
    });
    if (resultAlert.isConfirmed) {
      const result = await dispatch(deleteAluno(id));
      if (result.error) {
        showError({
          title: 'Erro!',
          text: 'Não foi possível excluir o aluno.',
        });
      } else {
        showSuccess({
          title: 'Confirmado!',
          text: 'Aluno excluído com sucesso.',
        });
      }
    }
  };

  return {
    handleDeleteAluno,
  };
}
