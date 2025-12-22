import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import {
  clearCurrent,
  clearStatus,
  createAula,
} from '@/store/slices/aulasSlice';
import { useToast } from '@/providers/ToastProvider';

export function useNovaAula() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action } = useSelector(
    state => state.aulas
  );

  const submit = ({ dataToSend }) => {
    dispatch(createAula(dataToSend));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'createAula') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Aula criado com sucesso!');
      router.push('/aulas');
    }
  }, [status, router, success, current, action, dispatch]);

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;

  return {
    message,
    errors,
    isLoading,
    submit,
  };
}
