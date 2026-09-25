import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  STATUS,
  STATUS_AULA,
  STATUS_AULA_LABEL,
  TIPO_AULA,
  FILTER_STORAGE_KEYS,
} from '@/constants';
import { getDashboard } from '@/store/slices/dashboardSlice';
import { updateAula, clearStatus } from '@/store/slices/aulasSlice';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { classNameDefault } from '@/components/ui/Fields/base';
import { loadFilters, saveFilters, clearFilters } from '@/utils/filterStorage';
import { getDatasPadrao } from '@/utils/getDatasPadrao';
import { countAppliedFilters } from '@/utils/filterCount';

const JANELA_PADRAO_MESES = 6;

export function useDashboard() {
  const dispatch = useDispatch();
  const aulasSlicer = useSelector(state => state.aulas);
  const { data, status } = useSelector(state => state.dashboard);
  const { showForm } = useSweetAlert();
  const { success, error } = useToast();
  const isLoading = status === STATUS.IDLE || status === STATUS.LOADING;

  const homeCardValues = useMemo(() => {
    const { totalAlunos, totalAulas, totalContratos } = data || {};
    return [
      { title: 'Total de Alunos', color: 'blue', value: totalAlunos },
      { title: 'Total de agendadas', color: 'green', value: totalAulas },
      { title: 'Contratos ativos', color: 'purple', value: totalContratos },
    ];
  }, [data]);
  const defaultFormData = {
    dataInicio: null,
    dataTermino: null,
    status: STATUS_AULA[0],
    tipo: TIPO_AULA[0],
    minhasAulas: true,
    professorId: '',
    alunoId: '',
  };

  const [formData, setFormData] = useState(() =>
    loadFilters(FILTER_STORAGE_KEYS.dashboard, defaultFormData)
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

  const handleSubmit = useCallback(
    formData => {
      dispatch(getDashboard(formData));
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
    clearFilters(FILTER_STORAGE_KEYS.dashboard);
    setFormData({
      ...defaultFormData,
      dataInicio: dataInicioFormatada,
      dataTermino: dataTerminoFormatada,
    });
  };

  const handleClick = async id => {
    const aula = data?.aulas?.find(a => a.id === id);
    const isSelected = status => (aula?.status === status ? 'selected' : '');
    const options = STATUS_AULA.map(
      status =>
        `<option value="${status}"${isSelected(status)}>
          ${STATUS_AULA_LABEL[status]}
        </option>`
    ).join('');

    const result = await showForm({
      title: 'Sobre a aula',
      html: `
            <div class="flex flex-col gap-4 w-full">
              <div class="flex flex-col items-start w-full min-w-0">
                <label for="swal-select" class="block text-sm font-medium text-main mb-2">
                  Status da aula
                </label>
                <select
                  id="swal-select"
                  class="${classNameDefault} max-w-full min-w-0 box-border disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                  ${options}
                </select>
              </div>

              <div class="flex flex-col items-start w-full min-w-0">
                <label for="swal-textarea" class="block text-sm font-medium text-main mb-2">
                  Conteúdo / Observações
                </label>
                <textarea
                  id="swal-textarea"
                  class="${classNameDefault} max-w-full min-w-0 box-border"
                  >
                  ${aula?.observacao || ''}
                </textarea>
              </div>
            </div>
          `,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const select = document.getElementById('swal-select');
        const textArea = document.getElementById('swal-textarea');
        return {
          status: select.value,
          observacao: textArea.value,
        };
      },
    });

    if (result.isConfirmed) {
      dispatch(updateAula({ id, data: result.value }));
    }
  };

  const appliedCount = countAppliedFilters(formData, {
    ...defaultFormData,
    dataInicio: datasPadraoDefault?.dataInicioFormatada ?? null,
    dataTermino: datasPadraoDefault?.dataTerminoFormatada ?? null,
  });

  useEffect(() => {
    // Guarda contra a janela em que `dataInicio`/`dataTermino` ainda são
    // `null` (valor estável até montar, DEC-002-003): sem ela, este efeito
    // dispara uma vez ANTES do efeito de default corrigir o estado, e o
    // backend trata ausência de filtro de data como "sem filtro" — busca a
    // tabela inteira, sem paginação, descartada em seguida (ACH-06, lição
    // `neutralizar-valor-ate-montar-exige-inventariar-consumidores`).
    if (formData.dataInicio === null || formData.dataTermino === null) return;

    saveFilters(FILTER_STORAGE_KEYS.dashboard, formData);
    handleSubmit(formData);
  }, [handleSubmit, formData]);

  useEffect(() => {
    if (aulasSlicer.action === 'updateAula') {
      switch (aulasSlicer.status) {
        case STATUS.SUCCESS:
          success('Operação realizada com sucesso!');
          break;
        case STATUS.FAILED:
          error(aulasSlicer.message || 'Tente novamente mais tarde.');
          break;
      }
      dispatch(clearStatus());
      dispatch(getDashboard(formData));
    }
  }, [
    aulasSlicer.action,
    aulasSlicer.status,
    aulasSlicer.message,
    success,
    error,
    formData,
    dispatch,
    handleSubmit,
  ]);

  return {
    aulas: data?.aulas || null,
    status,
    isLoading,
    formData,
    homeCardValues,
    handleSubmit,
    handleChange,
    handleClearFilter,
    handleClick,
    appliedCount,
  };
}
