/**
 * Fixa apenas a primeira coluna `essential` (sempre `#`, à esquerda) e a
 * coluna de ações (`isAction`, à direita) de uma tabela durante o scroll
 * horizontal contido ao container (DEC-002-001/005).
 *
 * Gate 11 (product-designer, Wave 2): fixar TODAS as colunas `essential`
 * somava, em `/aulas`/`/contratos`, mais que a largura visível de 375px
 * (4 essenciais × `ESSENTIAL_DEFAULT_WIDTH_PX` + `Ações`), deixando nenhuma
 * coluna visível em qualquer posição de scroll. Só `#` + `Ações` pinadas
 * cabem com folga (185px) e sobram ~110px de janela de rolagem — as demais
 * colunas `essential` continuam existindo e legíveis, por ordem/posição na
 * tabela, apenas sem `position: sticky`.
 *
 * Determinístico e sem medição em runtime (`ResizeObserver`/
 * `getBoundingClientRect`, DEC-002-005): a única coluna sticky à esquerda é
 * a primeira `essential` do array (na prática, `#`), sempre em `left: 0px`
 * — sem acumulação, porque não há uma segunda coluna sticky à esquerda para
 * a soma alcançar.
 *
 * Não muta o array/objetos recebidos — devolve um array novo.
 *
 * @param {Array<{
 *   essential?: boolean,
 *   isAction?: boolean,
 *   width?: string,
 * }>} columns
 * @returns {Array<object>} mesmo formato de `columns`, com `style`
 *   (`position: 'sticky'`) apenas na primeira coluna `essential` e na coluna
 *   `isAction`
 */
const ESSENTIAL_DEFAULT_WIDTH_PX = 140;
const STICKY_Z_INDEX = 1;
// `inherit`, não um token fixo: a célula sticky é filha direta da linha
// (`.rdt_TableRow`), que já pinta o próprio background (base, striped ou
// hover) via customStyles/tema — herdar o valor COMPUTADO do pai mantém a
// célula sticky opaca (nada de conteúdo rolado por baixo aparecendo) e, ao
// mesmo tempo, sincronizada com hover/zebra em tempo real. Um valor fixo
// (ex. token de tema) nunca muda com o estado da linha — célula sticky fica
// sem hover e sem zebra, parecendo "fora" da linha.
const STICKY_BACKGROUND_COLOR = 'inherit';

export function withStickyColumns(columns) {
  let stickyEssentialAssigned = false;

  return columns.map(column => {
    if (column.essential && !stickyEssentialAssigned) {
      stickyEssentialAssigned = true;
      const widthPx = column.width
        ? parseInt(column.width, 10)
        : ESSENTIAL_DEFAULT_WIDTH_PX;

      return {
        ...column,
        width: column.width || `${widthPx}px`,
        style: {
          position: 'sticky',
          left: '0px',
          zIndex: STICKY_Z_INDEX,
          backgroundColor: STICKY_BACKGROUND_COLOR,
        },
      };
    }

    if (column.isAction) {
      return {
        ...column,
        style: {
          position: 'sticky',
          right: '0px',
          zIndex: STICKY_Z_INDEX,
          backgroundColor: STICKY_BACKGROUND_COLOR,
        },
      };
    }

    return column;
  });
}
