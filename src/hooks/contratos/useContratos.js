import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getContratos } from '@/store/slices/contratosSlice';

export function useContratos() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.contratos);

  useEffect(() => {
    dispatch(getContratos());
  }, [dispatch]);

  const isAction = action === 'getContratos';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    contratos: list,
    status,
    isLoading,
  };
}
