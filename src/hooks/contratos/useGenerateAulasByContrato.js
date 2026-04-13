import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, STATUS_ERROR } from '@/constants';
import {
  clearStatus,
  clearCurrent,
  clearExtra,
  generateAulas,
} from '@/store/slices/contratosSlice';
import useSweetAlert from '../useSweetAlert';
import { calculateDuracaoAula } from '@/utils/calculateDuracaoAula';
import { classNameDefault } from '@/components/ui/Fields/base';

export function useGenerateAulasByContrato({ errorSubmit, setFormData }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cacheData, setCacheData] = useState(null);
  const { status, message, errors, extra, action, statusError, options } =
    useSelector(state => state.contratos);
  const { showForm } = useSweetAlert();

  const generateAulasByContrato = formData => {
    setIsSubmitting(true);
    const diasAulas = (formData.diasAulas || formData.currentDiasAulas || [])
      .filter(dia => dia.ativo !== false)
      .map(dia => ({
        diaSemana: dia.diaSemana,
        quantidadeAulas: dia.quantidadeAulas,
        duracaoAula: dia.duracaoAula
          ? parseInt(dia.duracaoAula)
          : calculateDuracaoAula(dia),
        horaInicial: dia.horaInicial,
        horaFinal: dia.horaFinal,
      }));
    const id = formData.id || formData.contrato?.id || formData.contratoId;
    const data = {
      dataInicio: formData.contrato?.dataInicio || formData.dataInicio,
      dataFim: formData.contrato?.dataTermino || formData.dataTermino,
      diasAulas: diasAulas,
      idProfessor: formData.professorId,
      id,
      confirm: formData.confirm,
      isEdit: Boolean(id),
    };
    dispatch(generateAulas({ data }));
    setCacheData(data);
  };

  const confirmModal = async (message, options) => {
    const result = await showForm({
      title: 'Confirmar ação',
      text: message,
      html: `
          <div class="flex flex-col gap-4">
            <label htmlFor="swal-select" className="block text-sm font-medium text-gray-700 mb-2">
                ${message}
              </label>
              <select
                id="swal-select"
                class="${classNameDefault} pr-10 appearance-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                ${options
                  .map(
                    option => `
                    <option value="${option.value}" >
                      ${option.label}
                    </option>`
                  )
                  .join('')}
              </select>
          </div>
          `,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      const select = document.getElementById('swal-select');
      const value = select.value;
      const confirm = value;
      const newFormData = { ...cacheData, confirm };
      setFormData(prev => ({
        ...prev,
        confirm,
      }));
      setCacheData(newFormData);
      dispatch(generateAulas({ data: newFormData }));
    }
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
    dispatch(clearExtra());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'generateAulas') {
      if (status === STATUS.SUCCESS && extra) {
        const aulasGenereted = (extra.aulas || []).map((aula, index) => ({
          id: aula.id || index + 1,
          ...aula,
        }));
        setFormData(prev => ({
          ...prev,
          aulasGenereted,
        }));
      } else if (
        status === STATUS.FAILED &&
        statusError === STATUS_ERROR.CONFLICT
      ) {
        confirmModal(message, options);
      } else {
        console.error({ message, errors });
      }
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, extra, action, message, errors]);

  return {
    generateAulasByContrato,
    isSubmitting,
  };
}
