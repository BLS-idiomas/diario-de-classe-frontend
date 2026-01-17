import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, STATUS_AULA, TIPO_AULA } from '@/constants';
import { getDashboard } from '@/store/slices/dashboardSlice';
import { useProfessores } from '../professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';

export function useDashboard(currentUser) {
  const dispatch = useDispatch();
  const { professores } = useProfessores();
  const { data, status } = useSelector(state => state.dashboard);
  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 6);
  const dataTerminoFormatada = dataFim.toISOString().split('T')[0];
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;
  const professorOptions =
    professores && professores.length > 0
      ? professores
          .filter(professor => professor.id !== currentUser.id)
          .map(professor => ({
            label: makeEmailLabel(professor),
            value: professor.id,
          }))
      : [];
  const [formData, setFormData] = useState({
    dataInicio: dataInicioFormatada,
    dataTermino: dataTerminoFormatada,
    status: STATUS_AULA[0],
    tipo: TIPO_AULA[0],
    minhasAulas: true,
    professorId: '',
  });

  const handleSubmit = useCallback(
    formData => {
      dispatch(getDashboard(formData));
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

  return {
    totalAulas: data?.totalAulas || null,
    totalAlunos: data?.totalAlunos || null,
    totalContratos: data?.totalContratos || null,
    aulas: data?.aulas || null,
    status,
    isLoading,
    formData,
    professorOptions,
    handleSubmit,
    handleChange,
  };
}
