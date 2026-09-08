import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { useEditarLivro } from './useEditarLivro';
import { getLivro, updateLivro } from '@/store/slices/livrosSlice';
import { STATUS, STATUS_ERROR } from '@/constants';

jest.mock('@/store/slices/livrosSlice', () => ({
  getLivro: jest.fn(id => ({ type: 'getLivro', payload: id })),
  updateLivro: jest.fn(args => ({ type: 'updateLivro', payload: args })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));

const renderizar = (estado = {}, id = 'livro-1') => {
  const store = configureStore({
    reducer: {
      livros: (
        state = {
          status: STATUS.IDLE,
          message: null,
          errors: [],
          current: null,
          action: null,
          statusError: null,
          ...estado,
        }
      ) => state,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return renderHook(() => useEditarLivro(id), { wrapper: Wrapper });
};

describe('useEditarLivro', () => {
  let push;
  let success;

  beforeEach(() => {
    jest.clearAllMocks();
    push = jest.fn();
    success = jest.fn();
    useRouter.mockReturnValue({ push });
    useToast.mockReturnValue({ success });
  });

  it('busca o livro no mount', () => {
    renderizar({}, 'livro-9');

    expect(getLivro).toHaveBeenCalledWith('livro-9');
  });

  it('não busca sem id', () => {
    renderizar({}, null);

    expect(getLivro).not.toHaveBeenCalled();
  });

  it('despacha updateLivro com id e dados', () => {
    const { result } = renderizar();

    act(() =>
      result.current.submit({ id: 'livro-1', dataToSend: { nivel: null } })
    );

    expect(updateLivro).toHaveBeenCalledWith({
      id: 'livro-1',
      data: { nivel: null },
    });
  });

  it('navega de volta ao livro após atualizar', () => {
    renderizar({
      status: STATUS.SUCCESS,
      current: { id: 'livro-1' },
      action: 'updateLivro',
    });

    expect(success).toHaveBeenCalledWith('Livro atualizado com sucesso!');
    expect(push).toHaveBeenCalledWith('/livros/livro-1');
  });

  it('marca notFound em 404 sem livro', () => {
    const { result } = renderizar({
      statusError: STATUS_ERROR.NOT_FOUND,
      current: null,
      action: 'getLivro',
    });

    expect(result.current.isNotFound).toBe(true);
  });

  it('isLoading só na própria ação de update', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'getLivro',
    });

    expect(result.current.isLoading).toBe(false);
  });
});
