import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, STATUS_ERROR } from '@/constants';
import {
  updateContrato,
  clearStatus,
  getContrato,
} from '@/store/slices/contratosSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export function useEditarContrato(contratoId) {
  console.log('contratoId:', contratoId);
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action, statusError } = useSelector(
    state => state.contratos
  );
  const isLoading = status === STATUS.LOADING && action === 'updateContrato';
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current &&
    action === 'getContrato';

  const submit = (id, dataToSend) =>
    dispatch(updateContrato({ id: id, data: dataToSend }));

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (contratoId) {
      dispatch(getContrato({ id: contratoId }));
    }
  }, [dispatch, contratoId]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'updateContrato') {
      dispatch(clearCurrent());
      dispatch(clearStatus());
      success('Contrato editado com sucesso!');
      router.push(`/contratos/${current.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, action, message, errors]);

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
