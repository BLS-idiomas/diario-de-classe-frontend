import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getProfessores } from '@/store/slices/professoresSlice';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import { searchFunction } from '@/utils/searchFunction';

export function useProfessores(currentUser = null) {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.professores);
  const searchParams = query =>
    searchFunction({ dispatch, query, perform: getProfessores });
  useEffect(() => {
    dispatch(getProfessores());
  }, [dispatch]);

  const isLoading =
    action === 'getProfessores' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  const professorOptions =
    list && list.length > 0
      ? list
          .filter(professor => professor.id !== currentUser?.id)
          .map(professor => ({
            label: makeEmailLabel(professor),
            value: professor.id,
          }))
      : [];

  return {
    professores: list,
    status,
    isLoading,
    professorOptions,
    searchParams,
  };
}
