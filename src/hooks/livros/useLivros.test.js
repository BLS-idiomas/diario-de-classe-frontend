import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useLivros } from './useLivros';
import { getLivros } from '@/store/slices/livrosSlice';
import { STATUS } from '@/constants';

jest.mock('@/store/slices/livrosSlice', () => ({
  getLivros: jest.fn(() => ({ type: 'livros/getAll' })),
}));

const criarStore = (livros = {}) =>
  configureStore({
    reducer: { livros: (state = livros) => state },
  });

const wrapper = store => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const renderizar = (estado = {}) => {
  const store = criarStore({
    list: [],
    status: STATUS.SUCCESS,
    action: 'getLivros',
    ...estado,
  });
  return renderHook(() => useLivros(), { wrapper: wrapper(store) });
};

describe('useLivros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca o catálogo no mount', () => {
    renderizar();

    expect(getLivros).toHaveBeenCalled();
  });

  it('busca sem filtro, para o cálculo de nível ver a lista completa', () => {
    renderizar();

    expect(getLivros).toHaveBeenCalledWith();
  });

  it('devolve a lista do store', () => {
    const list = [{ id: 'livro-1', nome: 'Interchange', idioma: 'INGLES' }];

    const { result } = renderizar({ list });

    expect(result.current.livros).toEqual(list);
  });

  it('monta as opções com o idioma traduzido', () => {
    const { result } = renderizar({
      list: [{ id: 'livro-1', nome: 'Interchange', idioma: 'INGLES' }],
    });

    expect(result.current.livroOptions).toEqual([
      { value: 'livro-1', label: 'Interchange (Inglês)' },
    ]);
  });

  it('devolve opções vazias sem livros', () => {
    const { result } = renderizar({ list: [] });

    expect(result.current.livroOptions).toEqual([]);
  });

  it('está carregando enquanto a ação é getLivros', () => {
    const { result } = renderizar({ status: STATUS.LOADING });

    expect(result.current.isLoading).toBe(true);
  });

  it('não está carregando quando a ação é de outro fluxo', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'createLivro',
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('expõe searchParams que dispara a busca', () => {
    const { result } = renderizar();

    result.current.searchParams('interchange');

    expect(getLivros).toHaveBeenCalled();
  });
});
