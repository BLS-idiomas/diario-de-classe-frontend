import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '@/constants';
import { getCronograma } from '@/store/slices/cronogramasSlice';

/**
 * Projeção do cronograma do aluno: a grade de aulas do contrato em curso com o
 * conteúdo do livro vinculado a cada uma.
 */
export function useCronograma(idAluno) {
  const dispatch = useDispatch();
  const {
    cronograma,
    linhas,
    conteudosNaoAgendados,
    resumo,
    status,
    action,
    message,
  } = useSelector(state => state.cronogramas);

  const isAction = action === 'getCronograma';
  const isLoading =
    isAction && (status === STATUS.IDLE || status === STATUS.LOADING);

  // Qualquer lançamento de conteúdo dispara resequenciamento no servidor, que
  // pode mexer em várias aulas de uma vez. Recarregar a projeção inteira é a
  // única forma de a tela refletir o banco.
  const recarregar = useCallback(() => {
    if (idAluno) dispatch(getCronograma(idAluno));
  }, [dispatch, idAluno]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  // União do que já caiu em aula com o que sobrou: é a lista completa de
  // conteúdos do livro, sem precisar de outra requisição.
  const conteudoOptions = [
    ...linhas
      .filter(linha => linha.idConteudo)
      .map(linha => ({
        value: linha.idConteudo,
        ordem: linha.ordem,
        label: `${linha.ordem}. ${linha.titulo}`,
      })),
    ...conteudosNaoAgendados.map(conteudo => ({
      value: conteudo.id,
      ordem: conteudo.ordem,
      label: `${conteudo.ordem}. ${conteudo.titulo}`,
    })),
  ].sort((a, b) => a.ordem - b.ordem);

  return {
    cronograma,
    livro: cronograma?.livro || null,
    linhas,
    conteudosNaoAgendados,
    conteudoOptions,
    resumo,
    message,
    isLoading,
    // Sem cronograma não é erro: é o aluno que ainda não foi matriculado.
    hasCronograma: Boolean(cronograma),
    recarregar,
  };
}
