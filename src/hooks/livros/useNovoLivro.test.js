import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { useNovoLivro } from './useNovoLivro';
import { createLivro } from '@/store/slices/livrosSlice';
import { STATUS } from '@/constants';

jest.mock('@/store/slices/livrosSlice', () => ({
  createLivro: jest.fn(data => ({ type: 'createLivro', payload: data })),
  clearStatus: jest.fn(() => ({ type: 'clearStatus' })),
  clearCurrent: jest.fn(() => ({ type: 'clearCurrent' })),
}));

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/providers/ToastProvider', () => ({ useToast: jest.fn() }));

const renderizar = (estado = {}) => {
  const store = configureStore({
    reducer: {
      livros: (
        state = {
          status: STATUS.IDLE,
          message: null,
          errors: [],
          current: null,
          action: null,
          ...estado,
        }
      ) => state,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return renderHook(() => useNovoLivro(), { wrapper: Wrapper });
};

describe('useNovoLivro', () => {
  let push;
  let success;

  beforeEach(() => {
    jest.clearAllMocks();
    push = jest.fn();
    success = jest.fn();
    useRouter.mockReturnValue({ push });
    useToast.mockReturnValue({ success });
  });

  it('despacha createLivro no submit', () => {
    const { result } = renderizar();

    act(() => result.current.submit({ dataToSend: { nome: 'X' } }));

    expect(createLivro).toHaveBeenCalledWith({ nome: 'X' });
  });

  it('navega para o livro criado e avisa por toast', () => {
    renderizar({
      status: STATUS.SUCCESS,
      current: { id: 'livro-1' },
      action: 'createLivro',
    });

    expect(success).toHaveBeenCalledWith('Livro criado com sucesso!');
    expect(push).toHaveBeenCalledWith('/livros/livro-1');
  });

  it('não navega quando a ação é de outro fluxo', () => {
    renderizar({
      status: STATUS.SUCCESS,
      current: { id: 'livro-1' },
      action: 'updateLivro',
    });

    expect(push).not.toHaveBeenCalled();
  });

  it('marca isLoading apenas na própria ação', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'createLivro',
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('não marca isLoading em ação alheia', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'getLivros',
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('expõe mensagem e erros de validação', () => {
    const { result } = renderizar({
      message: 'Erro de validação',
      errors: ['nome: obrigatório'],
    });

    expect(result.current.message).toBe('Erro de validação');
    expect(result.current.errors).toEqual(['nome: obrigatório']);
  });
});
