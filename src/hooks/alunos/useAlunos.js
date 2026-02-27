import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAlunos } from '@/store/slices/alunosSlice';
import { makeEmailLabel } from '@/utils/makeEmailLabel';

export function useAlunos() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.alunos);
  const alunoOptions =
    list && list.length > 0
      ? list.map(aluno => ({
          label: makeEmailLabel(aluno),
          value: aluno.id,
        }))
      : [];

  useEffect(() => {
    dispatch(getAlunos());
  }, [dispatch]);

  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    action === 'getAlunos';

  return {
    alunos: list,
    status,
    isLoading,
    alunoOptions,
  };
}
