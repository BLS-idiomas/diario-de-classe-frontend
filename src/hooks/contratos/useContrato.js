import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContrato } from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useContrato(id) {
  const dispatch = useDispatch();
  const { current, message, status, statusError, action } = useSelector(
    state => state.contratos
  );
  const isAction = action === 'getContrato';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current;

  useEffect(() => {
    if (id) dispatch(getContrato({ id }));
  }, [dispatch, id]);

  return {
    contrato: current,
    aluno: current?.aluno,
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
