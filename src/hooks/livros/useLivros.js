import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS, IDIOMA_LABEL } from '@/constants';
import { getLivros } from '@/store/slices/livrosSlice';
import { searchFunction } from '@/utils/searchFunction';

export function useLivros() {
  const dispatch = useDispatch();
  const { list, status, action } = useSelector(state => state.livros);
  const searchParams = query =>
    searchFunction({ dispatch, query, perform: getLivros });

  // Usado no select de matrícula do aluno em um livro.
  const livroOptions =
    list && list.length > 0
      ? list.map(livro => ({
          label: `${livro.nome} (${IDIOMA_LABEL[livro.idioma]})`,
          value: livro.id,
        }))
      : [];

  useEffect(() => {
    dispatch(getLivros());
  }, [dispatch]);

  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    action === 'getLivros';

  return {
    livros: list,
    status,
    isLoading,
    livroOptions,
    searchParams,
  };
}
