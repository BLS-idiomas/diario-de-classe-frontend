import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { clearStatus, uploadAlunos } from '@/store/slices/alunosSlice';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '../useSweetAlert';

export function useUploadAlunos() {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const { status, message, list, action } = useSelector(state => state.alunos);
  const { showInput } = useSweetAlert();

  const handleModalUpload = async () => {
    const options = {
      title: 'Selecionar arquivo',
      input: 'file',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: value => {
        if (!value) {
          return 'Selecione um arquivo!';
        }
      },
    };
    const result = await showInput(options);
    if (result.isConfirmed && result.value) {
      const file = result.value;
      const formData = new FormData();
      formData.append('file', file);
      dispatch(uploadAlunos(formData));
    }
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'uploadAlunos') {
      if (status === STATUS.SUCCESS && list) {
        dispatch(clearStatus());
        success('Alunos criados com sucesso!');
      } else if (status === STATUS.FAILED) {
        dispatch(clearStatus());
        error(`Erro ao criar alunos${Boolean(message) ? `: ${message}` : '!'}`);
      }
    }
  }, [status, success, error, message, list, action, dispatch]);

  // Estados computados para facilitar o uso
  const isUploading = status === STATUS.LOADING && action === 'uploadAlunos';

  return {
    message,
    isUploading,
    handleModalUpload,
  };
}
