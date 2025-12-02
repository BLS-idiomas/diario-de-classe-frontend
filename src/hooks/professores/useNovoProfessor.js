import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import {
  clearCurrent,
  clearStatus,
  createProfessor,
} from '@/store/slices/professoresSlice';
import { useToast } from '@/providers/ToastProvider';

export function useNovoProfessor() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action } = useSelector(
    state => state.professores
  );

  const submit = ({ dataToSend }) => {
    dispatch(createProfessor(dataToSend));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'createProfessor') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Professor criado com sucesso!');
      router.push('/professores');
    }
  }, [status, router, success, current, action, dispatch]);

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.LOADING;

  return {
    message,
    errors,
    isLoading,
    isSubmitting,
    submit,
  };
}
