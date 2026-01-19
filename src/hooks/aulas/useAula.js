import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAula } from '@/store/slices/aulasSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useAula(id) {
  const dispatch = useDispatch();
  const {
    current,
    aulas,
    diasAulas,
    contrato,
    contratos,
    message,
    status,
    statusError,
    action,
  } = useSelector(state => state.aulas);
  const isAction = action === 'getAula';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current;

  useEffect(() => {
    if (id) {
      dispatch(getAula(id));
    }
  }, [dispatch, id]);

  return {
    aula: current,
    aulas,
    diasAulas,
    contrato,
    contratos,
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
