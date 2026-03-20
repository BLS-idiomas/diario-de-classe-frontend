import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';
import { searchFunction } from '@/utils/searchFunction';

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.aulas);
  const searchParams = query =>
    searchFunction({ dispatch, query, perform: getAulas });
  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 3);
  const dataTerminoFormatada = dataFim.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    dataInicio: dataInicioFormatada,
    dataTermino: dataTerminoFormatada,
  });

  const handleSubmit = useCallback(
    formData => {
      dispatch(getAulas(formData));
    },
    [dispatch]
  );

  const handleChange = async e => {
    const { name, value, checked, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    handleSubmit(formData);
  }, [handleSubmit, formData]);

  const isLoading =
    action === 'getAulas' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    aulas: list,
    status,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    formData,
  };
}
