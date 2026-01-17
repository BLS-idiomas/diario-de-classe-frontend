'use client';

import { useEffect } from 'react';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useContratoForm } from '@/providers/ContratoFormProvider';
import { DIAS_LABEL } from '@/constants';
import {
  CheckboxField,
  FormGroup,
  InputField,
  SelectField,
} from '@/components';

export default function ContratoStep2() {
  const { formData, setDiasAulas } = useContratoForm();
  const { settings } = useUserAuth();
  const tempoAula = settings.duracaoAula || 0;

  const handleHoraFinalCalculation = ({
    horaInicial,
    quantidadeAulas,
    tempoAula,
  }) => {
    if (!horaInicial || !quantidadeAulas || quantidadeAulas <= 0) return '';
    const [hours, minutes] = horaInicial.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + quantidadeAulas * tempoAula;
    const finalHours = Math.floor(totalMinutes / 60) % 24;
    const finalMinutes = totalMinutes % 60;
    return `${finalHours.toString().padStart(2, '0')}:${finalMinutes
      .toString()
      .padStart(2, '0')}`;
  };

  const handleAtivoChange = e => {
    const { name, checked } = e.target;
    const newDiasAulas = formData.diasAulas.map(dia =>
      dia.diaSemana === name ? { ...dia, ativo: checked } : dia
    );
    setDiasAulas(newDiasAulas);
  };

  const handleHoraInicialChange = e => {
    const { name, value } = e.target;
    const newDiasAulas = formData.diasAulas.map(dia =>
      dia.diaSemana === name
        ? {
            ...dia,
            horaInicial: value,
            horaFinal: handleHoraFinalCalculation({
              horaInicial: value,
              quantidadeAulas: dia.quantidadeAulas,
              tempoAula,
            }),
          }
        : dia
    );
    setDiasAulas(newDiasAulas);
  };

  const handleQuantidadeAulasChange = e => {
    const { name, value } = e.target;
    const newDiasAulas = formData.diasAulas.map(dia =>
      dia.diaSemana === name
        ? {
            ...dia,
            quantidadeAulas: value,
            horaFinal: handleHoraFinalCalculation({
              horaInicial: dia.horaInicial,
              quantidadeAulas: value,
              tempoAula,
            }),
          }
        : dia
    );
    setDiasAulas(newDiasAulas);
  };

  useEffect(() => {
    const initialDiasAulas = [
      'SEGUNDA',
      'TERCA',
      'QUARTA',
      'QUINTA',
      'SEXTA',
      'SABADO',
      'DOMINGO',
    ].map(dia => ({
      diaSemana: dia,
      ativo: false,
      horaInicial: '',
      horaFinal: '',
      quantidadeAulas: 1,
    }));

    if (formData.currentDiasAulas && formData.currentDiasAulas.length > 0) {
      formData.currentDiasAulas.forEach(diaAtual => {
        const initialDiaAula = initialDiasAulas.find(
          dia => dia.diaSemana === diaAtual.diaSemana
        );
        if (initialDiaAula) {
          initialDiaAula.ativo = true;
          initialDiaAula.horaInicial = diaAtual.diaSemana;
          initialDiaAula.horaFinal = diaAtual.diaSemana;
          initialDiaAula.quantidadeAulas = diaAtual.diaSemana;
        }
      });
    }

    setDiasAulas(initialDiasAulas);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO Melhorar os campos desabilitados
  // TODO refazer a forma que HORA FINAL
  return (
    <div className="flex flex-col gap-4">
      <p>Registre as aulas que o aluno terá em cada dia da semana.</p>

      <FormGroup cols={2}>
        {formData.diasAulas.map(dia => (
          <div key={dia.diaSemana} className="flex flex-col gap-2 mb-4">
            <h4 className="text-xl font-semibold mb-2">
              {DIAS_LABEL[dia.diaSemana]}
            </h4>
            <CheckboxField
              htmlFor={dia.diaSemana}
              label="Ativo"
              checked={dia.ativo || false}
              onChange={handleAtivoChange}
            />
            <SelectField
              disabled={!dia.ativo}
              htmlFor={dia.diaSemana}
              label="Quantidade de aulas"
              onChange={handleQuantidadeAulasChange}
              options={[
                { label: '1 (40 min)', value: 1 },
                { label: '2 (80 min)', value: 2 },
                { label: '3 (120 min)', value: 3 },
              ]}
              value={dia.quantidadeAulas}
            />

            <InputField
              disabled={!dia.ativo}
              htmlFor={dia.diaSemana}
              label="Hora inicial"
              type="time"
              onChange={handleHoraInicialChange}
              value={dia.horaInicial}
            />

            <InputField
              disabled
              htmlFor={dia.diaSemana}
              label="Hora final"
              type="time"
              value={dia.horaFinal}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  );
}
