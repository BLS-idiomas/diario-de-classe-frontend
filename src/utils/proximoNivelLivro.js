/**
 * Próximo nível livre na trilha de um idioma.
 *
 * `nivel` é a ordem do livro dentro do idioma, então o próximo sai do maior
 * nível já usado naquele idioma — e não do catálogo inteiro. Sem nenhum livro
 * do idioma, começa em 1.
 *
 * É apenas valor default de formulário: o banco não tem unicidade em
 * (idioma, nivel), e o usuário pode trocar.
 *
 * @param {Array<{ idioma: string, nivel: number|null }>} livros
 * @param {string} idioma
 * @returns {number}
 */
export function proximoNivelLivro(livros, idioma) {
  if (!Array.isArray(livros) || !idioma) {
    return 1;
  }

  const niveis = livros
    .filter(livro => livro.idioma === idioma)
    .map(livro => Number(livro.nivel))
    .filter(nivel => Number.isFinite(nivel));

  if (niveis.length === 0) {
    return 1;
  }

  return Math.max(...niveis) + 1;
}
