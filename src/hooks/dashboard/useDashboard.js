import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getDashboard } from '@/store/slices/dashboardSlice';

export function useDashboard() {
  const dispatch = useDispatch();
  const { data, status } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  return {
    totalAulas: data?.totalAulas || null,
    totalAlunos: data?.totalAlunos || null,
    totalContratos: data?.totalContratos || null,
    minhasAulas: data?.minhasAulas || null,
    todasAsAulas: data?.todasAsAulas || null,
    status,
    isLoading,
  };
}
