import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useToast } from '@/providers/ToastProvider';
import useSweetAlert from '@/hooks/useSweetAlert';
import { useConteudosLivro } from './useConteudosLivro';
import {
  createConteudo,
  updateConteudo,
  deleteConteudo,
} from '@/store/slices/livrosSlice';

jest.mock('@/store/slices/livrosSlice', () => ({
  createConteudo: jest.fn(args => ({ type: 'createConteudo', payload: args })),
  updateConteudo: jest.fn(args => ({ type: 'updateConteudo', payload: args })),
  deleteConteudo: jest.fn(id => ({ type: 'deleteConteudo', payload: id })),
}));

jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));
jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const conteudos = [
  { id: 'c-1', ordem: 1, titulo: 'Unit 1', descricao: 'Greetings' },
  { id: 'c-2', ordem: 2, titulo: 'Unit 2', descricao: null },
];

describe('useConteudosLivro', () => {
  let showForm;
  let showConfirm;
  let showError;
  let success;
  let error;
  let dispatchResultado;

  const renderizar = (props = {}) => {
    const store = configureStore({
      reducer: { livros: (state = {}) => state },
    });
    store.dispatch = jest.fn(() => dispatchResultado);
    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    Wrapper.displayName = 'TestWrapper';
    return renderHook(
      () => useConteudosLivro({ idLivro: 'livro-1', conteudos, ...props }),
      { wrapper: Wrapper }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchResultado = {};
    showForm = jest
      .fn()
      .mockResolvedValue({ isConfirmed: true, value: { titulo: 'Unit 3' } });
    showConfirm = jest.fn().mockResolvedValue({ isConfirmed: true });
    showError = jest.fn();
    success = jest.fn();
    error = jest.fn();
    useSweetAlert.mockReturnValue({ showForm, showConfirm, showError });
    useToast.mockReturnValue({ success, error });
  });

  describe('tabela', () => {
    it('devolve as colunas esperadas', () => {
      const { result } = renderizar();

      expect(result.current.columns.map(c => c.name)).toEqual([
        'Ordem',
        'Conteúdo',
        'Descrição / tarefa',
        'Ações',
      ]);
    });

    it('remove a coluna de ações em readOnly', () => {
      const { result } = renderizar({ readOnly: true });

      expect(result.current.columns.map(c => c.name)).not.toContain('Ações');
    });

    it('mostra traço na descrição ausente', () => {
      const { result } = renderizar();

      expect(result.current.data[1].descricao).toBe('-');
    });
  });

  describe('escape de HTML no modal', () => {
    it('escapa a descrição, neutralizando a fuga do textarea', async () => {
      // Regressão: `</textarea><img src=x onerror=...>` escapava do campo e a
      // <img> entrava no DOM com o onerror intacto.
      const payload = '</textarea><img src=x onerror="alert(1)">';
      const { result } = renderizar({
        conteudos: [{ id: 'c-1', ordem: 1, titulo: 'ok', descricao: payload }],
      });

      await act(async () => {
        await result.current.handleEditarConteudo({
          id: 'c-1',
          ordem: 1,
          titulo: 'ok',
          descricao: payload,
        });
      });

      const { html } = showForm.mock.calls[0][0];
      expect(html).not.toContain('</textarea><img');
      expect(html).toContain('&lt;/textarea&gt;');
    });

    it('escapa o título no atributo value', async () => {
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleEditarConteudo({
          id: 'c-1',
          ordem: 1,
          titulo: 'x" onfocus="alert(1)',
          descricao: null,
        });
      });

      const { html } = showForm.mock.calls[0][0];
      expect(html).toContain('&quot; onfocus=&quot;');
    });
  });

  describe('criação', () => {
    it('despacha createConteudo com o livro e os dados', async () => {
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleNovoConteudo();
      });

      expect(createConteudo).toHaveBeenCalledWith({
        idLivro: 'livro-1',
        data: { titulo: 'Unit 3' },
      });
      expect(success).toHaveBeenCalled();
    });

    it('exige título', async () => {
      showForm.mockResolvedValue({ isConfirmed: true, value: { titulo: '' } });
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleNovoConteudo();
      });

      expect(showError).toHaveBeenCalled();
      expect(createConteudo).not.toHaveBeenCalled();
    });

    it('não cria quando o modal é cancelado', async () => {
      showForm.mockResolvedValue({ isConfirmed: false });
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleNovoConteudo();
      });

      expect(createConteudo).not.toHaveBeenCalled();
    });

    it('mostra a mensagem do backend na falha, como a ordem ocupada', async () => {
      dispatchResultado = {
        error: true,
        payload: { message: 'A ordem 2 já está ocupada neste livro' },
      };
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleNovoConteudo();
      });

      expect(error).toHaveBeenCalledWith(
        'A ordem 2 já está ocupada neste livro'
      );
    });
  });

  describe('edição', () => {
    it('despacha updateConteudo com o id do conteúdo', async () => {
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleEditarConteudo(conteudos[0]);
      });

      expect(updateConteudo).toHaveBeenCalledWith({
        id: 'c-1',
        data: { titulo: 'Unit 3' },
      });
    });
  });

  describe('exclusão', () => {
    it('pede confirmação antes de excluir', async () => {
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleDeleteConteudo('c-1');
      });

      expect(showConfirm).toHaveBeenCalled();
      expect(deleteConteudo).toHaveBeenCalledWith('c-1');
    });

    it('não exclui quando o usuário cancela', async () => {
      showConfirm.mockResolvedValue({ isConfirmed: false });
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleDeleteConteudo('c-1');
      });

      expect(deleteConteudo).not.toHaveBeenCalled();
    });

    it('mostra a mensagem do backend quando o conteúdo tem histórico', async () => {
      dispatchResultado = {
        error: true,
        payload: { message: 'Este conteúdo já foi dado em 3 aula(s)' },
      };
      const { result } = renderizar();

      await act(async () => {
        await result.current.handleDeleteConteudo('c-1');
      });

      expect(error).toHaveBeenCalledWith(
        'Este conteúdo já foi dado em 3 aula(s)'
      );
    });
  });
});
