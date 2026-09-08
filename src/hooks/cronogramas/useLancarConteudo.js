import { useDispatch } from 'react-redux';
import { updateConteudoAula } from '@/store/slices/cronogramasSlice';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useToast } from '@/providers/ToastProvider';
import { classNameDefault } from '@/components/ui/Fields/base';
import { escapeHtml } from '@/utils/escapeHtml';

/**
 * Lançamento por conteúdo: o professor escolhe à mão qual conteúdo do livro
 * aquela aula cobriu, em vez de aceitar a sequência automática.
 *
 * Escolher "sequência automática" devolve a aula ao controle do resequenciador.
 */
export function useLancarConteudo({ conteudoOptions = [], onSuccess }) {
  const dispatch = useDispatch();
  const { showForm, showError } = useSweetAlert();
  const { success, error } = useToast();

  const handleLancarConteudo = async linha => {
    if (!linha?.idAula) return;

    const opcoes = [
      { value: '', label: '— sequência automática —' },
      // O label carrega o título do conteúdo, que vem do servidor.
      ...conteudoOptions,
    ];

    const result = await showForm({
      title: 'Conteúdo da aula',
      html: `
        <div class="flex flex-col gap-4 w-full">
          <div class="flex flex-col items-start w-full min-w-0">
            <label for="swal-conteudo" class="block text-sm font-medium text-main mb-2">
              Conteúdo coberto nesta aula
            </label>
            <select
              id="swal-conteudo"
              class="${classNameDefault} max-w-full min-w-0 box-border"
            >
              ${opcoes
                .map(
                  opcao =>
                    `<option value="${opcao.value}" ${
                      opcao.value === (linha.idConteudo || '') ? 'selected' : ''
                    }>${escapeHtml(opcao.label)}</option>`
                )
                .join('')}
            </select>
          </div>

          <p class="text-sm text-muted">
            Ao escolher um conteúdo, esta aula deixa de acompanhar a sequência
            automática. As aulas seguintes são reajustadas.
          </p>
        </div>
      `,
      confirmButtonText: 'Lançar',
      preConfirm: () => ({
        idConteudo: document.getElementById('swal-conteudo')?.value || null,
      }),
    });

    if (!result.isConfirmed) return;

    const acao = await dispatch(
      updateConteudoAula({
        idAula: linha.idAula,
        idConteudo: result.value?.idConteudo || null,
      })
    );

    if (acao.error) {
      // O backend recusa conteúdo de outro livro, conteúdo já preso em outra
      // aula e aula que não consome conteúdo; a mensagem dele explica qual foi.
      showError({
        title: 'Não foi possível lançar',
        text: acao.payload?.message || 'Erro ao lançar o conteúdo da aula.',
      });
      return;
    }

    success('Conteúdo lançado!');
    if (onSuccess) onSuccess();
  };

  return {
    handleLancarConteudo,
  };
}
