import { useState } from 'react';

export function useAlunoForm({ id = null, submit, criador = '' }) {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    criador: criador,
    material: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    submit({ id, dataToSend: formData });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
