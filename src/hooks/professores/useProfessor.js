import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfessor } from '@/store/slices/professoresSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useProfessor(id) {
  const dispatch = useDispatch();
  const { current, message, status, statusError, action } = useSelector(
    state => state.professores
  );
  const isAction = action === 'getProfessor';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current;

  useEffect(() => {
    if (id) dispatch(getProfessor(id));
  }, [dispatch, id]);

  return {
    professor: current,
    aulas: current ? current.aulas : [],
    alunos: current ? current.alunos : [],
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
