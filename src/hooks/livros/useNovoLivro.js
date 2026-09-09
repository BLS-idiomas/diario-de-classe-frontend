import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import {
  clearCurrent,
  clearStatus,
  createLivro,
} from '@/store/slices/livrosSlice';
import { useToast } from '@/providers/ToastProvider';

export function useNovoLivro() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action } = useSelector(
    state => state.livros
  );

  const submit = ({ dataToSend }) => {
    dispatch(createLivro(dataToSend));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'createLivro') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Livro criado com sucesso!');
      router.push(`/livros/${current.id}`);
    }
  }, [status, router, success, current, action, dispatch]);

  const isLoading = status === STATUS.LOADING && action === 'createLivro';

  return {
    message,
    errors,
    isLoading,
    submit,
  };
}
