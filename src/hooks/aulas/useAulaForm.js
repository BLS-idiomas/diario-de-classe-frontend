import { useState } from 'react';

export function useAulaForm({ id = null, submit }) {
  const hoje = new Date();
  const dataInicioFormatada = hoje.toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    idAluno: '',
    idProfessor: '',
    idContrato: '',
    dataAula: dataInicioFormatada,
    horaInicial: '',
    horaFinal: '',
    tipo: 'PADRAO',
    status: 'AGENDADA',
    observacao: '',
  });

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
      ...formData,
      dataAula: formData.dataAula
        ? new Date(formData.dataAula).toISOString()
        : '',
    };
    submit({ id, dataToSend });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
