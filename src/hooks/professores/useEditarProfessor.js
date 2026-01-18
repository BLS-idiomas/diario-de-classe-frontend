import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateProfessor, getProfessor } from '@/store/slices/professoresSlice';
import { clearStatus, clearCurrent } from '@/store/slices/professoresSlice';

export function useEditarProfessor(professorId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.professores
  );
  const isLoading =
    status === STATUS.LOADING &&
    ['updateProfessor', 'getProfessor'].includes(action);

  const submit = ({ id, dataToSend }) => {
    dispatch(updateProfessor({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (professorId) {
      dispatch(getProfessor(professorId));
    }
  }, [dispatch, professorId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'updateProfessor') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push('/professores');
    }
  }, [status, router, success, current, action, dispatch]);

  return {
    statusError,
    message,
    errors,
    isLoading,
    current,
    submit,
  };
}
