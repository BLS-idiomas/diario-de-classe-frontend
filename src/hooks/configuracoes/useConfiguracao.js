import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  getConfiguracao,
  updateConfiguracao,
  clearStatus,
} from '@/store/slices/configuracaoSlice';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export function useConfiguracao() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { data, status, action, message, errors } = useSelector(
    state => state.configuracao
  );
  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    action === 'getConfiguracao';
  const isSubmitting =
    status === STATUS.LOADING && action === 'updateConfiguracao';

  const submit = dataToSend => {
    dispatch(updateConfiguracao(dataToSend));
  };

  useEffect(() => {
    dispatch(getConfiguracao());
  }, [dispatch]);

  useEffect(() => {
    if (status === STATUS.SUCCESS && data && action === 'updateConfiguracao') {
      dispatch(clearStatus());
      success('Operação realizada com sucesso!');
      router.push(`/configuracoes`);
    }
  }, [status, router, success, data, action, dispatch]);

  return {
    submit,
    configuracao: data,
    status,
    isLoading,
    message,
    errors,
    isSubmitting,
  };
}
