import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import {
  clearCurrent,
  clearStatus,
  createAluno,
} from '@/store/slices/alunosSlice';
import { useToast } from '@/providers/ToastProvider';

export function useNovoAluno() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action } = useSelector(
    state => state.alunos
  );

  const submit = ({ dataToSend }) => {
    dispatch(createAluno(dataToSend));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'createAluno') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Aluno criado com sucesso!');
      router.push('/alunos');
    }
  }, [status, router, success, current, action, dispatch]);

  // Estados computados para facilitar o uso
  const isAction = action === 'createAluno';
  const isLoading = status === STATUS.LOADING && isAction;
  const isSubmitting = status === STATUS.LOADING && isAction;

  return {
    message,
    errors,
    isLoading,
    isSubmitting,
    submit,
  };
}
