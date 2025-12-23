import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/constants';
import { useToast } from '@/providers/ToastProvider';
import { updateAndamentoAula } from '@/store/slices/aulasSlice';
import { clearStatus, clearCurrent } from '@/store/slices/aulasSlice';

export function useEditarAndamentoAula() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.aulas
  );
  const isLoading =
    action === 'updateAndamentoAula' && status === STATUS.LOADING;

  const submit = ({ id, dataToSend }) => {
    dispatch(updateAndamentoAula({ id: id, data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (
      status === STATUS.SUCCESS &&
      current &&
      action === 'updateAndamentoAula'
    ) {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
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
