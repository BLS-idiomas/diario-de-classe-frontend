import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfessor,
  getAulasProfessor,
  getAlunosProfessor,
} from '@/store/slices/professoresSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useProfessor(id) {
  const dispatch = useDispatch();
  const { current, aulas, alunos, message, status, statusError } = useSelector(
    state => state.professores
  );
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current;

  useEffect(() => {
    if (id) {
      dispatch(getProfessor(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && current) {
      dispatch(getAulasProfessor(id));
      dispatch(getAlunosProfessor(id));
    }
  }, [dispatch, id, current]);

  return {
    professor: current,
    aulas,
    alunos,
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
