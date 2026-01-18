import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS, STATUS_ERROR } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateAluno, getAluno } from '@/store/slices/alunosSlice';
import { clearStatus, clearCurrent } from '@/store/slices/alunosSlice';

export function useEditarAluno(alunoId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.alunos
  );
  const isLoading = status === STATUS.LOADING && action === 'updateAluno';
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current &&
    action === 'getAluno';

  const submit = ({ id, dataToSend }) => {
    dispatch(updateAluno({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (alunoId) {
      dispatch(getAluno(alunoId));
    }
  }, [dispatch, alunoId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'updateAluno') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push('/alunos');
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
