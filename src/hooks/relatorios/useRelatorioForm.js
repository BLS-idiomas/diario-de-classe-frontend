import { useState } from 'react';

export function useRelatorioForm({ relatorio, submit }) {
  const setInitialFiltros = filtros => {
    if (!filtros) return {};

    const initial = {};
    filtros.forEach(filtro => {
      switch (filtro.htmlFor) {
        case 'dataInicial':
          const hoje = new Date();
          const dataInicioFormatada = hoje.toISOString().split('T')[0];
          initial[filtro.htmlFor] = dataInicioFormatada;
          break;

        case 'dataFinal':
          const dataFinal = new Date();
          dataFinal.setMonth(dataFinal.getMonth() + 6);
          const dataFinalFormatada = dataFinal.toISOString().split('T')[0];
          initial[filtro.htmlFor] = dataFinalFormatada;
          break;

        default:
          initial[filtro.htmlFor] = '';
          break;
      }
    });

    return initial;
  };

  const [filtros, setFiltros] = useState(() =>
    setInitialFiltros(relatorio.filters)
  );

  const handleSubmit = () => {
    submit(relatorio.endpoint, filtros);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    filtros,
    handleChange,
    handleSubmit,
  };
}
