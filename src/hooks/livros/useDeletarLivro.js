import { useDispatch } from 'react-redux';
import { deleteLivro } from '@/store/slices/livrosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

export function useDeletarLivro() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showConfirm } = useSweetAlert();

  const handleDeleteLivro = async id => {
    const resultAlert = await showConfirm({
      title: 'Confirmar exclusão?',
      text: 'O livro e todos os seus conteúdos serão removidos!',
    });

    if (!resultAlert.isConfirmed) return;

    const result = await dispatch(deleteLivro(id));

    if (result.error) {
      // O backend recusa excluir livro em uso por algum cronograma e explica o
      // motivo na mensagem; repassar ajuda mais que um texto genérico.
      showError({
        title: 'Erro!',
        text: result.payload?.message || 'Não foi possível excluir o livro.',
      });
      return;
    }

    showSuccess({
      title: 'Confirmado!',
      text: 'Livro excluído com sucesso.',
    });
  };

  return {
    handleDeleteLivro,
  };
}
