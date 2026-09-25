import useSweetAlert from '@/hooks/useSweetAlert';

/**
 * Texto fixo da confirmação de alteração de duração (FR-001-004/AC-001-003) — sem
 * interpolação do valor digitado (DEC-002-006).
 */
export const TEXTO_CONFIRMACAO_DURACAO =
  'A mudança só altera a hora final sugerida no formulário de contrato para quem entrar no sistema depois dela, sem mudar aulas, dias de aula ou contratos.';

/**
 * Hook isolado (COMP-002-007, INDEX CONF-001): concentra toda a lógica de confirmação de
 * alteração de duração numa peça própria, removível sem tocar validação, estados de salvar
 * ou dirty tracking. `duracaoMudou` reflete a comparação já feita por quem chama (dirty
 * tracking de `useConfiguracaoForm`); este hook só decide se exibe o diálogo e quando chama
 * `onConfirmar`.
 */
export function useConfirmarAlteracaoDuracao({ duracaoMudou, onConfirmar }) {
  const { showConfirm } = useSweetAlert();

  const confirmarEGravar = async () => {
    if (!duracaoMudou) {
      onConfirmar();
      return;
    }

    const resultado = await showConfirm({
      title: 'Alterar a duração da aula?',
      text: TEXTO_CONFIRMACAO_DURACAO,
      confirmButtonText: 'Salvar',
    });
    if (resultado.isConfirmed) {
      onConfirmar();
    }
  };

  return { confirmarEGravar };
}

export default useConfirmarAlteracaoDuracao;
