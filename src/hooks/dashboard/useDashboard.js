import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, STATUS_AULA, STATUS_AULA_LABEL, TIPO_AULA } from '@/constants';
import { getDashboard } from '@/store/slices/dashboardSlice';
import { useProfessores } from '../professores/useProfessores';
import { makeEmailLabel } from '@/utils/makeEmailLabel';
import useSweetAlert from '../useSweetAlert';
import { updateAula } from '@/store/slices/aulasSlice';
import { useToast } from '@/providers/ToastProvider';
import { clearStatus } from '@/store/slices/aulasSlice';

export function useDashboard(currentUser) {
  const dispatch = useDispatch();
  const { showForm } = useSweetAlert();
  const { success, error } = useToast();
  const { data, status } = useSelector(state => state.dashboard);
  const aulasSlicer = useSelector(state => state.aulas);
  const { professores } = useProfessores();
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 6);
  const dataTerminoFormatada = dataFim.toISOString().split('T')[0];

  const professorOptions = useMemo(
    () =>
      professores && professores.length > 0
        ? professores
            .filter(professor => professor.id !== currentUser.id)
            .map(professor => ({
              label: makeEmailLabel(professor),
              value: professor.id,
            }))
        : [],
    [professores, currentUser.id]
  );
  const homeCardValues = useMemo(() => {
    const { totalAlunos, totalAulas, totalContratos } = data || {};
    return [
      { title: 'Total de Alunos', color: 'blue', value: totalAlunos },
      { title: 'Total de agendadas', color: 'green', value: totalAulas },
      { title: 'Contratos ativos', color: 'purple', value: totalContratos },
    ];
  }, [data]);
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

  const handleClick = async id => {
    const options = STATUS_AULA.map(
      status =>
        `<option value="${status}">${STATUS_AULA_LABEL[status]}</option>`
    ).join('');

    const result = await showForm({
      title: 'Alterar Status da Aula',
      html: `
            <select id="swal-select" class="swal2-input" style="width: 80%; padding: 10px; font-size: 16px;">
              ${options}
            </select>
          `,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const select = document.getElementById('swal-select');
        return select.value;
      },
    });

    if (result.isConfirmed) {
      dispatch(updateAula({ id: id, data: { status: result.value } }));
    }
  };

  useEffect(() => {
    handleSubmit(formData);
  }, [handleSubmit, formData]);

  useEffect(() => {
    if (aulasSlicer.action === 'updateAula') {
      switch (aulasSlicer.status) {
        case STATUS.SUCCESS:
          success('Operação realizada com sucesso!');
          break;
        case STATUS.FAILED:
          error(aulasSlicer.message || 'Tente novamente mais tarde.');
          break;
      }
      dispatch(clearStatus());
      dispatch(getDashboard(formData));
    }
  }, [
    aulasSlicer.action,
    aulasSlicer.status,
    aulasSlicer.message,
    success,
    error,
    formData,
    dispatch,
    handleSubmit,
  ]);

  return {
    aulas: data?.aulas || null,
    status,
    isLoading,
    formData,
    professorOptions,
    homeCardValues,
    handleSubmit,
    handleChange,
    handleClick,
  };
}
