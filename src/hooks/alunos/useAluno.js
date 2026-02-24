import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAluno } from '@/store/slices/alunosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

export function useAluno(id) {
  const dispatch = useDispatch();
  const { current, message, status, statusError, action } = useSelector(
    state => state.alunos
  );
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
    if (id) dispatch(getAluno(id));
  }, [dispatch, id]);

  return {
    aluno: current,
    aulas: current ? current.aulas : [],
    diasAulas: current ? current.diasAulas : [],
    contratos: current ? current.contratos : [],
    contrato: current ? current.contrato : {},
    message,
    isLoading,
    isSuccess,
    isFailed,
    isNotFound,
  };
}
