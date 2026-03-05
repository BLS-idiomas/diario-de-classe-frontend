import { useEffect, useState } from 'react';

export function useConfiguracaoForm({ submit, configuracao = null }) {
  const [formData, setFormData] = useState({
    id: '',
    duracaoAula: '',
    tolerancia: '',
    diasDeFuncionamento: [],
    confirmacao: false,
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiasDeFuncionamentoChange = e => {
    const { name, value, checked } = e.target;
    const [diaSemana, campo] = name.split('.');
    const diaDeFuncionamento = formData.diasDeFuncionamento.find(
      dia => dia.diaSemana === diaSemana
    );

    if (!diaDeFuncionamento) return;

    setFormData(prev => ({
      ...prev,
      diasDeFuncionamento: prev.diasDeFuncionamento.map(dia =>
        dia.diaSemana === diaSemana
          ? {
              ...diaDeFuncionamento,
              [campo]: campo === 'ativo' ? checked : value,
            }
          : dia
      ),
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const dataToSend = formData;
    submit(dataToSend);
  };

  useEffect(() => {
    if (configuracao) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({ ...configuracao, confirmacao: false });
    }
  }, [configuracao]);

  return {
    formData,
    handleSubmit,
    handleChange,
    handleDiasDeFuncionamentoChange,
    setFormData,
  };
}
