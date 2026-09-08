import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import {
  createConteudo,
  deleteConteudo,
  updateConteudo,
} from '@/store/slices/livrosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useToast } from '@/providers/ToastProvider';
import { classNameDefault } from '@/components/ui/Fields/base';
import { escapeHtml } from '@/utils/escapeHtml';

/**
 * CRUD dos conteúdos dentro da página do livro. Usa modal do SweetAlert em vez
 * de página própria porque o conteúdo é sempre editado no contexto do livro.
 */
export function useConteudosLivro({ idLivro, conteudos, readOnly = false }) {
  const dispatch = useDispatch();
  const { showForm, showConfirm, showError } = useSweetAlert();
  const { success, error } = useToast();

  // Todo dado de servidor passa por escapeHtml: o `html` do SweetAlert e
  // injetado via innerHTML, e uma descricao com `</textarea><img onerror=...>`
  // escapava do campo e executava.
  const camposDoFormulario = (conteudo = {}) => `
    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col items-start w-full min-w-0">
        <label for="swal-titulo" class="block text-sm font-medium text-main mb-2">
          Conteúdo
        </label>
        <input
          id="swal-titulo"
          class="${classNameDefault} max-w-full min-w-0 box-border"
          maxlength="255"
          value="${escapeHtml(conteudo.titulo)}"
        />
      </div>

      <div class="flex flex-col items-start w-full min-w-0">
        <label for="swal-descricao" class="block text-sm font-medium text-main mb-2">
          Descrição / tarefa
        </label>
        <textarea
          id="swal-descricao"
          class="${classNameDefault} max-w-full min-w-0 box-border"
          maxlength="2000"
          rows="3"
        >${escapeHtml(conteudo.descricao)}</textarea>
      </div>
    </div>
  `;

  const lerFormulario = () => {
    const titulo = document.getElementById('swal-titulo')?.value?.trim();
    const descricao = document.getElementById('swal-descricao')?.value?.trim();

    return { titulo, descricao: descricao || null };
  };

  const handleNovoConteudo = async () => {
    const result = await showForm({
      title: 'Novo conteúdo',
      html: camposDoFormulario(),
      preConfirm: lerFormulario,
    });

    if (!result.isConfirmed) return;

    if (!result.value?.titulo) {
      showError({ title: 'Erro!', text: 'Informe o conteúdo.' });
      return;
    }

    const acao = await dispatch(
      createConteudo({ idLivro, data: result.value })
    );

    if (acao.error) {
      error(acao.payload?.message || 'Erro ao criar conteúdo.');
      return;
    }

    success('Conteúdo criado com sucesso!');
  };

  const handleEditarConteudo = async conteudo => {
    const result = await showForm({
      title: `Conteúdo ${conteudo.ordem}`,
      html: camposDoFormulario(conteudo),
      preConfirm: lerFormulario,
    });

    if (!result.isConfirmed) return;

    if (!result.value?.titulo) {
      showError({ title: 'Erro!', text: 'Informe o conteúdo.' });
      return;
    }

    const acao = await dispatch(
      updateConteudo({ id: conteudo.id, data: result.value })
    );

    if (acao.error) {
      error(acao.payload?.message || 'Erro ao atualizar conteúdo.');
      return;
    }

    success('Conteúdo atualizado com sucesso!');
  };

  const handleDeleteConteudo = async id => {
    const confirmacao = await showConfirm({
      title: 'Confirmar exclusão?',
      text: 'O conteúdo será removido do livro e os cronogramas em curso serão reajustados.',
    });

    if (!confirmacao.isConfirmed) return;

    const acao = await dispatch(deleteConteudo(id));

    if (acao.error) {
      error(acao.payload?.message || 'Erro ao excluir conteúdo.');
      return;
    }

    success('Conteúdo excluído com sucesso!');
  };

  const columns = [
    {
      name: 'Ordem',
      selector: row => row.ordem,
      sortable: true,
      width: '90px',
    },
    {
      name: 'Conteúdo',
      selector: row => row.titulo,
      sortable: true,
    },
    {
      name: 'Descrição / tarefa',
      selector: row => row.descricao,
      sortable: false,
    },
    {
      name: 'Ações',
      selector: row => row.acoes,
      sortable: false,
      width: 'auto',
    },
  ];

  if (readOnly) {
    columns.splice(columns.length - 1, 1);
  }

  const data = useMemo(() => {
    if (!conteudos) return [];
    const iconParams = { strokeWidth: 1, size: 16, stroke: 'currentColor' };

    return conteudos.map(conteudo => ({
      ordem: conteudo.ordem,
      titulo: conteudo.titulo,
      descricao: conteudo.descricao || '-',
      acoes: (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditarConteudo(conteudo)}
            className="btn-outline btn-outline-secondary"
          >
            <Pencil {...iconParams} />
          </button>

          <button
            onClick={() => handleDeleteConteudo(conteudo.id)}
            className="btn-outline btn-outline-danger"
          >
            <Trash2 {...iconParams} />
          </button>
        </div>
      ),
    }));
    // handleEditarConteudo/handleDeleteConteudo são recriados a cada render;
    // incluí-los aqui invalidaria o memo sempre. As ações só dependem do id do
    // conteúdo, que já está em `conteudos`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conteudos]);

  return {
    columns,
    data,
    handleNovoConteudo,
    handleEditarConteudo,
    handleDeleteConteudo,
  };
}
