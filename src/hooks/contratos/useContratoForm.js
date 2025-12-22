import { useState } from 'react';

export function useContratoForm({ id = null, submit }) {
  const [formData, setFormData] = useState({
    idDoAluno: '',
    dataDeInicio: null,
    dataDeTermino: null,
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
    const data = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== null)
    );
    submit({ id, dataToSend: data });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    setFormData,
  };
}
