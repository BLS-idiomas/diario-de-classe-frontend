import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS, STATUS_ERROR } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import {
  getLivro,
  updateLivro,
  clearStatus,
  clearCurrent,
} from '@/store/slices/livrosSlice';

export function useEditarLivro(livroId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.livros
  );
  const isLoading = status === STATUS.LOADING && action === 'updateLivro';
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current &&
    action === 'getLivro';

  const submit = ({ id, dataToSend }) => {
    dispatch(updateLivro({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (livroId) {
      dispatch(getLivro(livroId));
    }
  }, [dispatch, livroId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'updateLivro') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Livro atualizado com sucesso!');
      router.push(`/livros/${current.id}`);
    }
  }, [status, router, success, current, action, dispatch]);

  return {
    statusError,
    message,
    errors,
    isLoading,
    isNotFound,
    current,
    submit,
  };
}
