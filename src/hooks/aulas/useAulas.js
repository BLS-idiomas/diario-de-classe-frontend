import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';
import { searchFunction } from '@/utils/searchFunction';

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.aulas);
  const searchParams = query =>
    searchFunction({ dispatch, query, perform: getAulas });

  useEffect(() => {
    dispatch(getAulas());
  }, [dispatch]);

  const isLoading =
    action === 'getAulas' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    aulas: list,
    status,
    isLoading,
    searchParams,
  };
}
