import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCronograma } from './useCronograma';
import { getCronograma } from '@/store/slices/cronogramasSlice';
import { STATUS } from '@/constants';

jest.mock('@/store/slices/cronogramasSlice', () => ({
  getCronograma: jest.fn(id => ({ type: 'getCronograma', payload: id })),
}));

const renderizar = (estado = {}, idAluno = 'aluno-1') => {
  const store = configureStore({
    reducer: {
      cronogramas: (
        state = {
          cronograma: null,
          linhas: [],
          conteudosNaoAgendados: [],
          resumo: null,
          status: STATUS.SUCCESS,
          action: 'getCronograma',
          message: null,
          ...estado,
        }
      ) => state,
    },
  });
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  Wrapper.displayName = 'TestWrapper';
  return renderHook(() => useCronograma(idAluno), { wrapper: Wrapper });
};

describe('useCronograma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca a projeção no mount', () => {
    renderizar({}, 'aluno-9');

    expect(getCronograma).toHaveBeenCalledWith('aluno-9');
  });

  it('não busca sem aluno', () => {
    renderizar({}, null);

    expect(getCronograma).not.toHaveBeenCalled();
  });

  it('hasCronograma é falso sem livro em curso', () => {
    const { result } = renderizar({ cronograma: null });

    expect(result.current.hasCronograma).toBe(false);
  });

  it('expõe o livro do cronograma', () => {
    const { result } = renderizar({
      cronograma: { id: 'cron-1', livro: { nome: 'Interchange' } },
    });

    expect(result.current.hasCronograma).toBe(true);
    expect(result.current.livro.nome).toBe('Interchange');
  });

  it('monta as opções de conteúdo unindo agendados e não agendados, em ordem', () => {
    // A união é a lista completa do livro, sem precisar de outra requisição.
    const { result } = renderizar({
      cronograma: { id: 'cron-1' },
      linhas: [
        { idAula: 'a1', idConteudo: 'c-2', ordem: 2, titulo: 'Unit 2' },
        { idAula: 'a2', idConteudo: null, ordem: null, titulo: null },
      ],
      conteudosNaoAgendados: [{ id: 'c-1', ordem: 1, titulo: 'Unit 1' }],
    });

    expect(result.current.conteudoOptions).toEqual([
      { value: 'c-1', ordem: 1, label: '1. Unit 1' },
      { value: 'c-2', ordem: 2, label: '2. Unit 2' },
    ]);
  });

  it('ignora linhas sem conteúdo nas opções', () => {
    const { result } = renderizar({
      linhas: [{ idAula: 'a1', idConteudo: null, ordem: null, titulo: null }],
    });

    expect(result.current.conteudoOptions).toEqual([]);
  });

  it('recarregar despacha a busca de novo', () => {
    const { result } = renderizar();
    jest.clearAllMocks();

    act(() => result.current.recarregar());

    expect(getCronograma).toHaveBeenCalledWith('aluno-1');
  });

  it('isLoading verdadeiro em IDLE', () => {
    const { result } = renderizar({ status: STATUS.IDLE });

    expect(result.current.isLoading).toBe(true);
  });

  it('isLoading falso quando a ação é de outro fluxo', () => {
    const { result } = renderizar({
      status: STATUS.LOADING,
      action: 'createCronograma',
    });

    expect(result.current.isLoading).toBe(false);
  });
});
