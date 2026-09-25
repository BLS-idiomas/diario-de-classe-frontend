import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, FILTER_STORAGE_KEYS } from '@/constants';
import { getAulas } from '@/store/slices/aulasSlice';
import { loadFilters, saveFilters, clearFilters } from '@/utils/filterStorage';
import { getDatasPadrao } from '@/utils/getDatasPadrao';
import { countAppliedFilters } from '@/utils/filterCount';

const JANELA_PADRAO_MESES = 3;

export function useAulas() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.aulas);

  const defaultFormData = {
    dataInicio: null,
    dataTermino: null,
    tipo: '',
    status: '',
    idAluno: '',
    idProfessor: '',
    q: '',
  };

  const [formData, setFormData] = useState(() =>
    loadFilters(FILTER_STORAGE_KEYS.aulas, defaultFormData)
  );

  // Datas padrão computadas (não nulas), usadas só como base de comparação
  // de `appliedCount` — nascem `null` (mesma paridade SSR do `formData`) para
  // não contar como "filtro aplicado" o preenchimento automático do efeito
  // abaixo, que ainda não é escolha do usuário (lição
  // `flag-de-escolha-deriva-da-presenca-nunca-de-comparacao-com-default`).
  const [datasPadraoDefault, setDatasPadraoDefault] = useState(null);

  useEffect(() => {
    const { dataInicioFormatada, dataTerminoFormatada } =
      getDatasPadrao(JANELA_PADRAO_MESES);
    // Efeito roda uma única vez, na montagem, para preencher datas que
    // nasceram nulas por desenho (paridade SSR — ver DEC-002-003/PLAN-002);
    // dependências vazias são intencionais, não esquecidas.
    // Devolve a mesma referência (`prev`) quando as duas já estão
    // preenchidas (filtro salvo) — senão o efeito de busca, que depende de
    // `formData`, dispara de novo por causa da identidade nova do objeto.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(prev =>
      prev.dataInicio !== null && prev.dataTermino !== null
        ? prev
        : {
            ...prev,
            dataInicio:
              prev.dataInicio === null ? dataInicioFormatada : prev.dataInicio,
            dataTermino:
              prev.dataTermino === null
                ? dataTerminoFormatada
                : prev.dataTermino,
          }
    );
    setDatasPadraoDefault({ dataInicioFormatada, dataTerminoFormatada });
  }, []);

  const searchParams = query =>
    setFormData(prevState => ({
      ...prevState,
      q: query,
    }));

  const handleSubmit = useCallback(
    formData => {
      dispatch(getAulas(formData));
    },
    [dispatch]
  );

  const handleChange = async e => {
    const { name, value, checked, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleClearFilter = () => {
    const { dataInicioFormatada, dataTerminoFormatada } =
      getDatasPadrao(JANELA_PADRAO_MESES);
    clearFilters(FILTER_STORAGE_KEYS.aulas);
    setFormData({
      ...defaultFormData,
      dataInicio: dataInicioFormatada,
      dataTermino: dataTerminoFormatada,
    });
  };

  useEffect(() => {
    // Guarda contra a janela em que `dataInicio`/`dataTermino` ainda são
    // `null` (valor estável até montar, DEC-002-003): sem ela, este efeito
    // dispara uma vez ANTES do efeito de default corrigir o estado, e o
    // backend trata ausência de filtro de data como "sem filtro" — busca a
    // tabela inteira, sem paginação, descartada em seguida (ACH-06, lição
    // `neutralizar-valor-ate-montar-exige-inventariar-consumidores`).
    if (formData.dataInicio === null || formData.dataTermino === null) return;

    saveFilters(FILTER_STORAGE_KEYS.aulas, formData);
    handleSubmit(formData);
  }, [handleSubmit, formData]);

  const isLoading =
    action === 'getAulas' &&
    (status === STATUS.IDLE || status === STATUS.LOADING);

  const appliedCount = countAppliedFilters(formData, {
    ...defaultFormData,
    dataInicio: datasPadraoDefault?.dataInicioFormatada ?? null,
    dataTermino: datasPadraoDefault?.dataTerminoFormatada ?? null,
  });

  return {
    aulas: list,
    status,
    isLoading,
    searchParams,
    handleSubmit,
    handleChange,
    handleClearFilter,
    formData,
    appliedCount,
  };
}
