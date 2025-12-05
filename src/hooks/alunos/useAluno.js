import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAluno,
  getAulasAluno,
  getDiasAulasAluno,
  getContratoAluno,
} from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';

export function useAluno(id) {
  const dispatch = useDispatch();
  const { current, aulas, diasAulas, contrato, message, status, statusError } =
    useSelector(state => state.alunos);
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const isSuccess = status === STATUS.SUCCESS;
  const isFailed = status === STATUS.FAILED;

  useEffect(() => {
    if (id) {
      dispatch(getAluno(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && current) {
      dispatch(getAulasAluno(id));
      dispatch(getDiasAulasAluno(id));
      dispatch(getContratoAluno(id));
    }
  }, [dispatch, id, current]);

  return {
    aluno: current,
    aulas,
    diasAulas,
    contrato,
    message,
    isLoading,
    isSuccess,
    isFailed,
    statusError,
  };
}
