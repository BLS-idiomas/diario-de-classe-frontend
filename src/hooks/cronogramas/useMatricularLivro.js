import { useDispatch } from 'react-redux';
import { createCronograma } from '@/store/slices/cronogramasSlice';
import { getLivros } from '@/store/slices/livrosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useToast } from '@/providers/ToastProvider';
import { classNameDefault } from '@/components/ui/Fields/base';
import { escapeHtml } from '@/utils/escapeHtml';
import { todayLocalDate } from '@/utils/todayLocalDate';
import { IDIOMA_LABEL } from '@/constants';

/**
 * Matricula o aluno em um livro: "o aluno entrou hoje no livro X".
 * Encerra o livro anterior e distribui os conteúdos pelas aulas do contrato.
 *
 * O catálogo é buscado dentro do handler, e não no mount: antes o perfil de
 * qualquer aluno baixava a lista inteira de livros só para popular um select de
 * um modal que talvez nunca abrisse.
 */
export function useMatricularLivro({ idAluno, contratos = [], onSuccess }) {
  const dispatch = useDispatch();
  const { showForm, showError } = useSweetAlert();
  const { success, error } = useToast();

  const montarOpcoesContrato = contratosDisponiveis =>
    contratosDisponiveis
      .map(
        contrato =>
          `<option value="${escapeHtml(contrato.id)}">${escapeHtml(
            IDIOMA_LABEL[contrato.idioma] || contrato.idioma
          )} — ${escapeHtml(contrato.status)}</option>`
      )
      .join('');

  const montarOpcoesLivro = livros =>
    livros
      .map(
        livro =>
          `<option value="${escapeHtml(livro.id)}">${escapeHtml(
            `${livro.nome} (${IDIOMA_LABEL[livro.idioma] || livro.idioma})`
          )}</option>`
      )
      .join('');

  // Todo dado de servidor passa por escapeHtml: o `html` do SweetAlert é
  // injetado via innerHTML e o nome do livro pode vir de planilha importada.
  const camposDoFormulario = (contratosDisponiveis, livros) => `
    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col items-start w-full min-w-0">
        <label for="swal-contrato" class="block text-sm font-medium text-main mb-2">
          Contrato
        </label>
        <select
          id="swal-contrato"
          class="${classNameDefault} max-w-full min-w-0 box-border"
        >
          ${montarOpcoesContrato(contratosDisponiveis)}
        </select>
      </div>

      <div class="flex flex-col items-start w-full min-w-0">
        <label for="swal-livro" class="block text-sm font-medium text-main mb-2">
          Livro
        </label>
        <select
          id="swal-livro"
          class="${classNameDefault} max-w-full min-w-0 box-border"
        >
          ${montarOpcoesLivro(livros)}
        </select>
      </div>

      <div class="flex flex-col items-start w-full min-w-0">
        <label for="swal-data" class="block text-sm font-medium text-main mb-2">
          Início no livro
        </label>
        <input
          type="date"
          id="swal-data"
          class="${classNameDefault} max-w-full min-w-0 box-border"
          value="${todayLocalDate()}"
        />
      </div>
    </div>
  `;

  const handleMatricular = async () => {
    const contratosDisponiveis = contratos.filter(contrato =>
      ['ATIVO', 'PENDENTE'].includes(contrato.status)
    );

    if (contratosDisponiveis.length === 0) {
      showError({
        title: 'Nenhum contrato disponível',
        text: 'O aluno precisa de um contrato ativo ou pendente para ter cronograma.',
      });
      return;
    }

    const buscaLivros = await dispatch(getLivros());
    const livros = buscaLivros.payload?.data || [];

    if (livros.length === 0) {
      showError({
        title: 'Nenhum livro cadastrado',
        text: 'Cadastre um livro antes de montar o cronograma do aluno.',
      });
      return;
    }

    const result = await showForm({
      title: 'Matricular em um livro',
      html: camposDoFormulario(contratosDisponiveis, livros),
      confirmButtonText: 'Matricular',
      preConfirm: () => ({
        idContrato: document.getElementById('swal-contrato')?.value,
        idLivro: document.getElementById('swal-livro')?.value,
        dataInicio: document.getElementById('swal-data')?.value,
      }),
    });

    if (!result.isConfirmed) return;

    const { idContrato, idLivro, dataInicio } = result.value || {};

    if (!idContrato || !idLivro) {
      showError({ title: 'Erro!', text: 'Selecione o contrato e o livro.' });
      return;
    }

    const acao = await dispatch(
      createCronograma({
        idAluno,
        data: { idContrato, idLivro, dataInicio: dataInicio || undefined },
      })
    );

    if (acao.error) {
      // O backend recusa livro inativo, contrato encerrado e livro de outro
      // idioma; a mensagem dele explica qual foi.
      error(acao.payload?.message || 'Erro ao matricular o aluno no livro.');
      return;
    }

    success('Aluno matriculado no livro!');
    if (onSuccess) onSuccess();
  };

  return {
    handleMatricular,
  };
}
