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
  } = useSelector(state => state.aulas);
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;
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
