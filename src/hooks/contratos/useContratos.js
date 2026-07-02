import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, FILTER_STORAGE_KEYS } from '@/constants';
import { getContratos } from '@/store/slices/contratosSlice';
import { loadFilters, saveFilters, clearFilters } from '@/utils/filterStorage';

export function useContratos() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.contratos);

  const defaultFormData = {
    dataInicio: '',
    dataTermino: '',
    idioma: '',
    idAluno: '',
    q: '',
  };

  const [formData, setFormData] = useState(() =>
    loadFilters(FILTER_STORAGE_KEYS.contratos, defaultFormData)
  );

  const searchParams = query =>
    setFormData(prevState => ({
      ...prevState,
      q: query,
    }));

  const handleSubmit = useCallback(
    formData => {
      dispatch(getContratos(formData));
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
    clearFilters(FILTER_STORAGE_KEYS.contratos);
    setFormData(defaultFormData);
  };

  useEffect(() => {
    saveFilters(FILTER_STORAGE_KEYS.contratos, formData);
    handleSubmit(formData);
  }, [handleSubmit, formData]);

  const isAction = action === 'getContratos';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);

  return {
    contratos: list,
    status,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    handleClearFilter,
    formData,
  };
}
