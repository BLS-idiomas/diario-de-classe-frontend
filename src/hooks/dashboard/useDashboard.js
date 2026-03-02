import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, STATUS_AULA, STATUS_AULA_LABEL, TIPO_AULA } from '@/constants';
import { getDashboard } from '@/store/slices/dashboardSlice';
import useSweetAlert from '../useSweetAlert';
import { updateAula } from '@/store/slices/aulasSlice';
import { useToast } from '@/providers/ToastProvider';
import { clearStatus } from '@/store/slices/aulasSlice';
import { classNameDefault } from '@/components/ui/Fields/base';

export function useDashboard() {
  const dispatch = useDispatch();
  const aulasSlicer = useSelector(state => state.aulas);
  const { data, status } = useSelector(state => state.dashboard);
  const { showForm } = useSweetAlert();
  const { success, error } = useToast();
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const dataFim = new Date(hoje);
  dataFim.setMonth(dataFim.getMonth() + 6);
  const dataTerminoFormatada = dataFim.toISOString().split('T')[0];
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
    alunoId: '',
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
    const aula = data?.aulas?.find(a => a.id === id);
    const isSelected = status => (aula?.status === status ? 'selected' : '');
    const options = STATUS_AULA.map(
      status =>
        `<option value="${status}"${isSelected(status)}>
          ${STATUS_AULA_LABEL[status]}
        </option>`
    ).join('');

    const result = await showForm({
      title: 'Sobre a aula',
      html: `
            <div class="flex flex-col gap-4 ">
              <div class="flex flex-col items-start">
                <label htmlFor="swal-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Status da aula
                </label>
                <select
                  id="swal-select"
                  class="${classNameDefault} pr-10 appearance-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                  ${options}
                </select>
              </div>

              <div class="flex flex-col items-start">
                <label htmlFor="swal-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo / Observações
                </label>
                <textarea
                  id="swal-textarea"
                  class="${classNameDefault}"
                  >
                  ${aula?.observacao || ''}
                </textarea>
              </div>
            </div>
          `,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const select = document.getElementById('swal-select');
        const textArea = document.getElementById('swal-textarea');
        return {
          status: select.value,
          observacao: textArea.value,
        };
      },
    });

    if (result.isConfirmed) {
      dispatch(updateAula({ id, data: result.value }));
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
    homeCardValues,
    handleSubmit,
    handleChange,
    handleClick,
  };
}
