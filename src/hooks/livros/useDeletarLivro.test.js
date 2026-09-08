import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDeletarLivro } from './useDeletarLivro';
import { deleteLivro } from '@/store/slices/livrosSlice';
import useSweetAlert from '@/hooks/useSweetAlert';

jest.mock('@/store/slices/livrosSlice', () => ({
  deleteLivro: jest.fn(id => ({ type: 'deleteLivro', payload: id })),
}));

jest.mock('@/hooks/useSweetAlert', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useDeletarLivro', () => {
  let showConfirm;
  let showSuccess;
  let showError;
  let dispatchResultado;

  const renderizar = () => {
    const store = configureStore({
      reducer: { livros: (state = {}) => state },
    });
    store.dispatch = jest.fn(() => dispatchResultado);
    const Wrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );
    Wrapper.displayName = 'TestWrapper';
    return renderHook(() => useDeletarLivro(), { wrapper: Wrapper });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    showConfirm = jest.fn().mockResolvedValue({ isConfirmed: true });
    showSuccess = jest.fn();
    showError = jest.fn();
    dispatchResultado = {};
    useSweetAlert.mockReturnValue({ showConfirm, showSuccess, showError });
  });

  it('pede confirmação antes de excluir', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleDeleteLivro('livro-1');
    });

    expect(showConfirm).toHaveBeenCalled();
    expect(deleteLivro).toHaveBeenCalledWith('livro-1');
  });

  it('não exclui quando o usuário cancela', async () => {
    showConfirm.mockResolvedValue({ isConfirmed: false });
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleDeleteLivro('livro-1');
    });

    expect(deleteLivro).not.toHaveBeenCalled();
  });

  it('avisa sucesso ao excluir', async () => {
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleDeleteLivro('livro-1');
    });

    expect(showSuccess).toHaveBeenCalled();
  });

  it('repassa a mensagem do backend quando o livro está em uso', async () => {
    // O backend recusa excluir livro usado por cronograma e explica o motivo;
    // um texto genérico esconderia a razão de quem está na tela.
    dispatchResultado = {
      error: true,
      payload: { message: 'Este livro está em uso por 2 cronograma(s)' },
    };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleDeleteLivro('livro-1');
    });

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Este livro está em uso por 2 cronograma(s)',
      })
    );
    expect(showSuccess).not.toHaveBeenCalled();
  });

  it('cai em texto genérico quando o backend não manda mensagem', async () => {
    dispatchResultado = { error: true, payload: {} };
    const { result } = renderizar();

    await act(async () => {
      await result.current.handleDeleteLivro('livro-1');
    });

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Não foi possível excluir o livro.' })
    );
  });
});
