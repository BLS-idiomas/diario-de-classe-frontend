import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { STATUS } from '@/constants';

import {
  getRelatorios,
  getRelatorioByReport,
  clearStatus,
} from '@/store/slices/relatorioSlice';

export function useRelatorios() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { success } = useToast();
  const { file, data, status, action, message, errors } = useSelector(
    state => state.relatorio
  );
  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    action === 'getRelatorios';
  const isSubmitting =
    status === STATUS.LOADING && action === 'getRelatorioByReport';

  const submit = (report, params) => {
    dispatch(getRelatorioByReport({ report, params }));
  };

  useEffect(() => {
    dispatch(getRelatorios());
  }, [dispatch]);

  useEffect(() => {
    if (
      status === STATUS.SUCCESS &&
      file &&
      action === 'getRelatorioByReport'
    ) {
      dispatch(clearStatus());
      dispatch(clearFile());
      success('Operação realizada com sucesso!');
    }
  }, [status, router, success, file, action, dispatch]);

  return {
    submit,
    file,
    data,
    status,
    isLoading,
    message,
    errors,
    isSubmitting,
  };
}
