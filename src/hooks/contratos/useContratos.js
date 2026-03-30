import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getContratos } from '@/store/slices/contratosSlice';

export function useContratos() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.contratos);

  const [formData, setFormData] = useState({
    dataInicio: '',
    dataTermino: '',
    idioma: '',
    idAluno: '',
    q: '',
  });

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

  useEffect(() => {
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
    formData,
  };
}
