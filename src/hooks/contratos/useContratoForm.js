import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserAuth } from '@/providers/UserAuthProvider';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useNovoContrato } from './useNovoContrato';
import { TIPO_AULA_LABEL } from '@/constants';
import Swal from 'sweetalert2';

export function useContratoForm({ alunos, professores, submit }) {
  const { currentUser, settings } = useUserAuth();
  const { showForm, showSuccess } = useSweetAlert();
  const tempoAula = settings.duracaoAula || 0;
  const [formData, setFormData] = useState({
    professorId: currentUser.id || null,
    professor: currentUser || null,
    alunoId: null,
    aluno: null,
    contratoId: null,
    contrato: null,
    dataInicio: '',
    dataTermino: '',
    diasAulas: [],
    currentDiasAulas: [],
    aulas: [],
  });

  // Sets
  const setAluno = aluno => {
    setFormData(prev => ({
      ...prev,
      aluno,
    }));
  };
  const setProfessor = professor => {
    setFormData(prev => ({
      ...prev,
      professor,
    }));
  };
  const setDiasAulas = diasAulas => {
    setFormData(prev => ({
      ...prev,
      diasAulas,
    }));
  };
  const setAulas = aulas => {
    setFormData(prev => ({
      ...prev,
      aulas,
    }));
  };
  const setInitialDiasAulas = (diasAulas = []) => {
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

    diasAulas ||= formData.currentDiasAulas;

    if (diasAulas && diasAulas.length > 0) {
      diasAulas.forEach(diaAtual => {
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
  };
  // Handles
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    const dataToSend = {
      idAluno: formData.alunoId,
      idProfessor: formData.professorId,
      dataInicio: formData.dataInicio,
      dataTermino: formData.dataTermino,
      diasAulas: formData.diasAulas,
      aulas: formData.aulas,
    };

    formData.diasAulas.forEach(diaAula => {
      dataToSend[diaAula.diaSemana] = {
        quantidadeAulas: diaAula.quantidadeAulas,
        horaInicial: diaAula.horaInicial,
        ativo: diaAula.ativo,
      };
    });
    submit(dataToSend);
  };
  const handleAlunoChange = e => {
    const { value } = e.target;
    handleChange(e);
    setInitialDiasAulas;
    setAluno(
      alunos.find(aluno => aluno.id.toString() === value.toString()) || null
    );
  };
  const handleProfessorChange = e => {
    const { value } = e.target;
    handleChange(e);
    setProfessor(
      professores.find(
        professor => professor.id.toString() === value.toString()
      ) || null
    );
  };
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
  const handleDeleteAula = aulaId => {
    const updatedAulas = formData.aulas.filter(aula => aula.id !== aulaId);
    setAulas(updatedAulas);
  };
  const handleEditAula = async aula => {
    const result = await getFormCreateAula({ aula, aulas: formData.aulas });
    if (result.isConfirmed && result.value) {
      const updatedAulas = formData.aulas.map(newAula => {
        if (newAula.id === aula.id) {
          return { ...newAula, ...result.value };
        }
        return newAula;
      });

      setAulas(updatedAulas);
      showSuccess({
        title: 'Aula atualizada!',
        text: 'As informações da aula foram atualizadas com sucesso.',
      });
    }
  };
  // gets
  const getFormCreateAula = async ({ aula, aulas }) => {
    const title = aula ? 'Editar Aula' : 'Nova Aula';
    const formateDateValue = dateStr => {
      if (!dateStr) return '';
      return dateStr.split('T')[0];
    };
    aula = {
      dataAula: formateDateValue(aula?.dataAula),
      horaInicial: aula?.horaInicial || '',
      horaFinal: aula?.horaFinal || '',
      tipo: aula?.tipo || 'PADRAO',
      observacao: aula?.observacao || '',
    };
    return await showForm({
      title: title,
      html: `
                            <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
                              <div>
                                <label for="dataAula" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Data da Aula</label>
                                <input id="dataAula" type="date" class="swal2-input" value="${aula.dataAula}" style="margin: 0; width: 100%;">
                              </div>
                              <div>
                                <label for="horaInicial" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Hora Inicial</label>
                                <input id="horaInicial" type="time" class="swal2-input" value="${aula.horaInicial}" style="margin: 0; width: 100%;">
                              </div>
                              <div>
                                <label for="horaFinal" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Hora Final</label>
                                <input id="horaFinal" type="time" class="swal2-input" value="${aula.horaFinal}" style="margin: 0; width: 100%;">
                              </div>
                              <div>
                                <label for="tipo" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Tipo</label>
                                <select id="tipo" class="swal2-input" style="margin: 0; width: 100%;">
                                  <option value="PADRAO" ${aula.tipo === 'PADRAO' ? 'selected' : ''}>${TIPO_AULA_LABEL.PADRAO}</option>
                                  <option value="REPOSICAO" ${aula.tipo === 'REPOSICAO' ? 'selected' : ''}>${TIPO_AULA_LABEL.REPOSICAO}</option>
                                  <option value="OUTRA" ${aula.tipo === 'OUTRA' ? 'selected' : ''}>${TIPO_AULA_LABEL.OUTRA}</option>
                                </select>
                              </div>
                              <div>
                                <label for="observacao" style="display: block; margin-bottom: 0.25rem; font-weight: 500;">Observação (opcional)</label>
                                <input id="observacao" type="text" class="swal2-input" placeholder="Digite uma observação..." value="${aula.observacao || ''}" style="margin: 0; width: 100%;">
                              </div>
                            </div>
                          `,
      preConfirm: () => {
        const dataAula = document.getElementById('dataAula').value;
        const horaInicial = document.getElementById('horaInicial').value;
        const horaFinal = document.getElementById('horaFinal').value;
        const tipo = document.getElementById('tipo').value;
        const observacao = document.getElementById('observacao').value;

        if (!dataAula || !horaInicial || !horaFinal || !tipo) {
          Swal.showValidationMessage(
            'Por favor, preencha todos os campos obrigatórios'
          );
          return false;
        }

        if (aula.dataAula != dataAula) {
          const aulaExistente = aulas.find(
            a => formateDateValue(a.dataAula) === dataAula
          );

          if (aulaExistente) {
            Swal.showValidationMessage(
              'Já existe uma aula cadastrada para esta data.'
            );
            return false;
          }
        }

        return {
          dataAula: new Date(dataAula).toISOString(),
          horaInicial,
          horaFinal,
          tipo,
          observacao,
        };
      },
    });
  };
  const getNewStepByFormData = formData => {
    const {
      professorId,
      alunoId,
      aluno,
      contratoId,
      contrato,
      currentDiasAulas,
      aulas,
    } = formData;
    const step2 = contratoId && contrato && professorId && alunoId && aluno;
    const step3 = step2 && currentDiasAulas && currentDiasAulas.length > 0;
    const step4 = step3 && contrato.dataInicio && contrato.dataTermino;
    const step5 = step4 && aulas && aulas.length > 0;
    if (Boolean(step5)) return 5;
    if (Boolean(step4)) return 4;
    if (Boolean(step3)) return 3;
    if (Boolean(step2)) return 2;
    return 1;
  };
  // create
  const createAula = async () => {
    const result = await getFormCreateAula({ aulas: formData.aulas });
    if (result.isConfirmed && result.value) {
      const newAula = {
        id: formData.aulas.length + 1,
        ...result.value,
      };

      setAulas([...formData.aulas, newAula]);
      showSuccess({
        title: 'Aula criada!',
        text: 'A nova aula foi adicionada com sucesso.',
      });
    }
  };
  // effects
  useEffect(() => {
    setInitialDiasAulas();
  }, []);

  return {
    formData,
    setFormData,
    setInitialDiasAulas,
    getNewStepByFormData,
    handleChange,
    handleSubmit,
    handleAlunoChange,
    handleProfessorChange,
    handleAtivoChange,
    handleHoraInicialChange,
    handleQuantidadeAulasChange,
    handleDeleteAula,
    handleEditAula,
    createAula,
  };
}
