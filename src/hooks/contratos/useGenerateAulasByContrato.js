import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import {
  clearStatus,
  clearCurrent,
  clearExtra,
  generateAulas,
} from '@/store/slices/contratosSlice';

export function useGenerateAulasByContrato({ errorSubmit, setFormData }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { status, message, errors, extra, action } = useSelector(
    state => state.contratos
  );

  const generateAulasByContrato = formData => {
    setIsSubmitting(true);
    const diasAulas = formData.diasAulas
      .filter(dia => dia.ativo)
      .map(dia => ({
        diaSemana: dia.diaSemana,
        quantidadeAulas: dia.quantidadeAulas,
        horaInicial: dia.horaInicial,
        horaFinal: dia.horaFinal,
      }));
    const dataToSend = {
      dataInicio: formData.dataInicio,
      dataFim: formData.dataTermino,
      diasAulas: diasAulas,
    };

    dispatch(generateAulas({ data: dataToSend }));
  };

  useEffect(() => {
    dispatch(clearStatus());
    dispatch(clearCurrent());
    dispatch(clearExtra());
  }, [dispatch]);

  useEffect(() => {
    if (action === 'generateAulas') {
      if (status === STATUS.SUCCESS && extra) {
        const aulas = (extra.aulas || []).map((aula, index) => ({
          id: aula.id || index + 1,
          ...aula,
        }));
        setFormData(prev => ({
          ...prev,
          aulas,
        }));
      } else if (status === STATUS.FAILED) {
        errorSubmit({ message, errors });
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
