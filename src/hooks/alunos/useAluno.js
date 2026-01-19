import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAluno,
  getAulasAluno,
  getDiasAulasAluno,
  getContratoAluno,
  getContratosAluno,
} from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useAluno(id) {
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
  } = useSelector(state => state.alunos);
  const isAction = action === 'getAluno';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current &&
    isAction;

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
      dispatch(getContratosAluno(id));
    }
  }, [dispatch, id, current]);

  return {
    aluno: current,
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
