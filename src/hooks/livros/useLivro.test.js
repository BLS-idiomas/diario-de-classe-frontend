import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useLivro } from './useLivro';
import { getLivro } from '@/store/slices/livrosSlice';
import { STATUS } from '@/constants';
import { STATUS_ERROR } from '@/constants/statusError';

jest.mock('@/store/slices/livrosSlice', () => ({
  getLivro: jest.fn(() => ({ type: 'livros/getOne' })),
}));

const renderizar = (estado = {}, id = 'livro-1') => {
  const store = configureStore({
    reducer: {
      livros: (
        state = {
          current: null,
          conteudos: [],
          message: null,
          status: STATUS.SUCCESS,
          statusError: null,
          action: 'getLivro',
          ...estado,
        }
      ) => state,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return renderHook(() => useLivro(id), { wrapper: Wrapper });
};

describe('useLivro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca o livro pelo id', () => {
    renderizar({}, 'livro-9');

    expect(getLivro).toHaveBeenCalledWith('livro-9');
  });

  it('não busca sem id', () => {
    renderizar({}, null);

    expect(getLivro).not.toHaveBeenCalled();
  });

  it('devolve livro e conteúdos', () => {
    const { result } = renderizar({
      current: { id: 'livro-1', nome: 'Interchange' },
      conteudos: [{ id: 'c-1', ordem: 1 }],
    });

    expect(result.current.livro.nome).toBe('Interchange');
    expect(result.current.conteudos).toHaveLength(1);
  });

  it('marca notFound em 404 sem livro carregado', () => {
    const { result } = renderizar({
      statusError: STATUS_ERROR.NOT_FOUND,
      current: null,
      status: STATUS.FAILED,
    });

    expect(result.current.isNotFound).toBe(true);
  });

  it('não marca notFound quando a ação é de outro fluxo', () => {
    const { result } = renderizar({
      statusError: STATUS_ERROR.NOT_FOUND,
      current: null,
      action: 'createLivro',
    });

    expect(result.current.isNotFound).toBe(false);
  });

  it('está carregando em IDLE, e não só em LOADING', () => {
    const { result } = renderizar({ status: STATUS.IDLE });

    expect(result.current.isLoading).toBe(true);
  });
});
