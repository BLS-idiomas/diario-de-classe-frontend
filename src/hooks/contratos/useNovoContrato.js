import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { createContrato, clearStatus } from '@/store/slices/contratosSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export function useNovoContrato() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { status, message, errors, current, action } = useSelector(
    state => state.contratos
  );

  const submit = dataToSend => dispatch(createContrato(dataToSend));

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && current && action === 'createContrato') {
      success('Contrato criado com sucesso!');
      router.push(`/contratos/${current.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, current, action, message, errors]);
  const isLoading = status === STATUS.LOADING && action === 'createContrato';

  return {
    message,
    errors,
    isLoading,
    submit,
  };
}
