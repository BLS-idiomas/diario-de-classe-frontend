import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContrato } from '@/store/slices/contratosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';
import { getAluno } from '@/store/slices/alunosSlice';

export function useContrato(id) {
  const dispatch = useDispatch();
  const { current, message, status, statusError, action } = useSelector(
    state => state.contratos
  );
  const alunos = useSelector(state => state.alunos);
  const isAction = action === 'getContrato';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);
  const isSuccess = isAction && status === STATUS.SUCCESS;
  const isFailed = isAction && status === STATUS.FAILED;
  const isNotFound =
    [STATUS_ERROR.BAD_REQUEST, STATUS_ERROR.NOT_FOUND].includes(statusError) &&
    !current;

  useEffect(() => {
    if (id) {
      dispatch(getContrato({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && current && current.idAluno) {
      dispatch(getAluno(current.idAluno));
    }
  }, [dispatch, id, current]);

  return {
    contrato: current,
    aluno: alunos.current,
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
