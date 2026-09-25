import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { STATUS } from '@/constants';
import { getAlunos } from '@/store/slices/alunosSlice';
import { makeEmailLabel } from '@/utils/makeEmailLabel';

const SEARCH_DEBOUNCE_MS = 300;

export function useAlunos() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const urlSearchParams = useSearchParams();
  const { list, status, action } = useSelector(state => state.alunos);
  const debounceTimeoutRef = useRef(null);

  const q = urlSearchParams.get('q') || '';

  // Padrão de referência para as demais telas (BI-35): a URL é a fonte de
  // verdade da busca, não só um efeito colateral. `searchParams` apenas
  // escreve a URL via replace (não push, para não empilhar uma entrada de
  // histórico por tecla) com debounce; o fetch em si é DERIVADO do valor de
  // `q` lido da URL, no useEffect abaixo — nunca disparado direto por aqui.
  const searchParams = query => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const nextParams = new URLSearchParams(urlSearchParams.toString());
      const trimmedQuery = query ? query.trim() : '';
      if (trimmedQuery) {
        nextParams.set('q', trimmedQuery);
      } else {
        nextParams.delete('q');
      }
      const queryString = nextParams.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Deriva o fetch do valor de `q` da URL: cobre o mount inicial e qualquer
  // mudança de URL sem remount (ex.: navegação que reseta a query string).
  useEffect(() => {
    dispatch(getAlunos(q || null));
  }, [dispatch, q]);

  const alunoOptions =
    list && list.length > 0
      ? list.map(aluno => ({
          label: makeEmailLabel(aluno),
          value: aluno.id,
        }))
      : [];

  const isLoading =
    (status === STATUS.IDLE || status === STATUS.LOADING) &&
    action === 'getAlunos';

  return {
    alunos: list,
    status,
    action,
    isLoading,
    alunoOptions,
    searchParams,
    initialValue: q,
  };
}
