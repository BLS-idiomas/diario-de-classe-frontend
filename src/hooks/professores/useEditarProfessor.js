import { useEffect, useState, useMemo } from 'react';
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
  const { status, message, errors, current } = useSelector(
    state => state.professores
  );
  const [submitted, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (professorId) {
      dispatch(getProfessor(professorId));
    }
  }, [dispatch, professorId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && submitted) {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push('/professores');
    }
  }, [status, router, success, current, dispatch, submitted]);

  const submit = ({ id, dataToSend }) => {
    dispatch(updateProfessor({ id: id, data: dataToSend }));
    setSubmitting(true);
  };

  // Estados computados para facilitar o uso
  const isLoading = status === STATUS.LOADING;
  const isSubmitting = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    message,
    errors,
    isLoading,
    isSubmitting,
    current,
    submit,
  };
}
