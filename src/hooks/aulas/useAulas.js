import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, FILTER_STORAGE_KEYS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';
import { loadFilters, saveFilters, clearFilters } from '@/utils/filterStorage';

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.aulas);

  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 3);
  const dataTerminoFormatada = dataFim.toISOString().split('T')[0];

  const defaultFormData = {
    dataInicio: dataInicioFormatada,
    dataTermino: dataTerminoFormatada,
    tipo: '',
    status: '',
    idAluno: '',
    idProfessor: '',
    q: '',
  };

  const [formData, setFormData] = useState(() =>
    loadFilters(FILTER_STORAGE_KEYS.aulas, defaultFormData)
  );

  const searchParams = query =>
    setFormData(prevState => ({
      ...prevState,
      q: query,
    }));

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

  const handleClearFilter = () => {
    clearFilters(FILTER_STORAGE_KEYS.aulas);
    setFormData(defaultFormData);
  };

  useEffect(() => {
    saveFilters(FILTER_STORAGE_KEYS.aulas, formData);
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
    handleClearFilter,
    formData,
  };
}
