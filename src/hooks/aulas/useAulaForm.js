import { DURACAO_AULA } from '@/constants';
import { calculateHoraFimByDuracaoAula } from '@/utils/calculateHoraFim';
import { todayLocalDate } from '@/utils/todayLocalDate';
import { useState, useEffect } from 'react';

export function useAulaForm({ id = null, submit }) {
  const [formData, setFormData] = useState({
    idAluno: '',
    idProfessor: '',
    idContrato: '',
    dataAula: null,
    duracaoAula: DURACAO_AULA[40],
    horaInicial: '',
    horaFinal: '',
    tipo: 'PADRAO',
    status: 'AGENDADA',
    observacao: '',
  });
  // DEC-002-006: mapa local por campo, distinto do `errors` do servidor
  // exposto por `useNovaAula`/`useEditarAula` — SearchableSelectField não é
  // elemento de formulário nativo, então `required` não o valida de graça.
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const dataInicioFormatada = todayLocalDate();
    // Efeito roda uma única vez, na montagem, para preencher `dataAula` que
    // nasceu nula por desenho (paridade SSR — ver DEC-002-003/PLAN-002);
    // dependências vazias são intencionais, não esquecidas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(prev =>
      prev.dataAula !== null ? prev : { ...prev, dataAula: dataInicioFormatada }
    );
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    let extraData = {};

    if (['horaInicial', 'duracaoAula'].includes(name)) {
      extraData.horaFinal = calculateHoraFimByDuracaoAula({
        horaInicial: name === 'horaInicial' ? value : formData.horaInicial,
        duracaoAula: name === 'duracaoAula' ? value : formData.duracaoAula,
      });
    }

    setFormData(prev => ({
      ...prev,
      ...extraData,
      [name]: value,
    }));

    if (value && fieldErrors[name]) {
      setFieldErrors(prev => {
        const rest = { ...prev };
        delete rest[name];
        return rest;
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newFieldErrors = {};
    if (!formData.idAluno) {
      newFieldErrors.idAluno = 'Selecione um aluno.';
    }
    if (!formData.idProfessor) {
      newFieldErrors.idProfessor = 'Selecione um professor.';
    }
    if (!formData.idContrato) {
      newFieldErrors.idContrato = 'Selecione um contrato.';
    }
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      // SearchableSelectField não é elemento de formulário nativo — sem
      // `required` HTML nativo, o navegador não move foco/rolagem ao primeiro
      // campo inválido sozinho; por isso movemos aqui, só no bloqueio do
      // submit (nunca no ponto que limpa um erro), para não reabrir o foco a
      // cada correção do usuário.
      const primeiroCampoComErro = newFieldErrors.idAluno
        ? 'idAluno'
        : newFieldErrors.idProfessor
          ? 'idProfessor'
          : 'idContrato';
      document.getElementById(primeiroCampoComErro)?.focus();
      return;
    }
    setFieldErrors({});
    const dataToSend = {
      ...formData,
      duracaoAula: parseInt(formData.duracaoAula),
      dataAula: formData.dataAula
        ? new Date(formData.dataAula).toISOString()
        : '',
    };
    submit({ id, dataToSend });
  };

  return {
    formData,
    fieldErrors,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
