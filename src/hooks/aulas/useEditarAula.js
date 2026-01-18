import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateAula, getAula } from '@/store/slices/aulasSlice';
import { clearStatus, clearCurrent } from '@/store/slices/aulasSlice';

export function useEditarAula(aulaId, backUrl = null) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.aulas
  );
  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    ['updateAula', 'getAula'].includes(action);

  const submit = ({ id, dataToSend }) => {
    dispatch(updateAula({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (aulaId) {
      dispatch(getAula(aulaId));
    }
  }, [dispatch, aulaId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'updateAula') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push(backUrl || '/aulas');
    }
  }, [status, router, success, current, action, dispatch, backUrl]);

  return {
    statusError,
    message,
    errors,
    isLoading,
    current,
    submit,
  };
}
