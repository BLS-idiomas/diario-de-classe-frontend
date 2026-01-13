import { useState } from 'react';

export function useAulaForm({ id = null, submit }) {
  const [formData, setFormData] = useState({
    idAluno: '',
    idProfessor: '',
    idContrato: '',
    dataAula: '',
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
