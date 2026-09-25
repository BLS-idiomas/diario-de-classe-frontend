import { useEffect, useState } from 'react';
import { getDatasPadrao } from '@/utils/getDatasPadrao';

const JANELA_PADRAO_MESES = 6;

export function useRelatorioForm({ relatorio, submit }) {
  const setInitialFiltros = filtros => {
    if (!filtros) return {};

    const initial = {};
    filtros.forEach(filtro => {
      switch (filtro.htmlFor) {
        case 'dataInicial':
        case 'dataFinal':
          // Literal, nunca calculado aqui: `new Date()` só entra em jogo no
          // useEffect([]) pós-montagem, abaixo.
          initial[filtro.htmlFor] = null;
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

  useEffect(() => {
    const { dataInicioFormatada, dataTerminoFormatada: dataFinalFormatada } =
      getDatasPadrao(JANELA_PADRAO_MESES);

    // Efeito roda uma única vez, na montagem, para preencher datas que
    // nasceram nulas por desenho (paridade SSR — ver DEC-002-003/PLAN-002);
    // dependências vazias são intencionais, não esquecidas.
    // Mesma causa raiz de useAulas.js/useDashboard.js (identidade nova mesmo
    // sem nada a preencher): devolve `prev` quando as duas já estão
    // preenchidas — aqui sem consequência de rede, mas pela mesma disciplina.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiltros(prev =>
      prev.dataInicial !== null && prev.dataFinal !== null
        ? prev
        : {
            ...prev,
            ...(prev.dataInicial === null && {
              dataInicial: dataInicioFormatada,
            }),
            ...(prev.dataFinal === null && { dataFinal: dataFinalFormatada }),
          }
    );
  }, []);

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
