import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { clearStatus, uploadConteudos } from '@/store/slices/livrosSlice';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';

export function useUploadConteudos(idLivro) {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { status, message, action } = useSelector(state => state.livros);
  const { showInput, showConfirm } = useSweetAlert();

  const handleModalUpload = async () => {
    // A importação substitui todo o conteúdo do livro: confirmar antes evita
    // que alguém apague a sequência inteira sem perceber.
    const confirmacao = await showConfirm({
      title: 'Importar planilha?',
      text: 'A planilha substitui todos os conteúdos deste livro. Coluna A = conteúdo, coluna B = descrição.',
      confirmButtonText: 'Selecionar arquivo',
    });

    if (!confirmacao.isConfirmed) return;

    const result = await showInput({
      title: 'Selecionar planilha',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: value => {
        if (!value) {
          return 'Selecione um arquivo!';
        }
      },
    });

    if (!result.isConfirmed || !result.value) return;

    const formData = new FormData();
    formData.append('file', result.value);
    dispatch(uploadConteudos({ idLivro, file: formData }));
  };

  useEffect(() => {
    if (action !== 'uploadConteudos') return;

    if (status === STATUS.SUCCESS) {
      dispatch(clearStatus());
      success('Conteúdos importados com sucesso!');
    } else if (status === STATUS.FAILED) {
      dispatch(clearStatus());
      error(`Erro ao importar conteúdos${message ? `: ${message}` : '!'}`);
    }
  }, [status, action, message, success, error, dispatch]);

  const isUploading = status === STATUS.LOADING && action === 'uploadConteudos';

  return {
    message,
    isUploading,
    handleModalUpload,
  };
}
