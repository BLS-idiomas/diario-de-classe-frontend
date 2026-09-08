/**
 * Escapa dado para interpolação segura em template HTML.
 *
 * Os modais do projeto passam uma string de HTML para o `html` do SweetAlert,
 * que a injeta via `innerHTML` sem sanitizar. Interpolar dado de servidor cru
 * ali permite injeção: uma descrição de conteúdo com
 * `</textarea><img src=x onerror=...>` escapa do campo e o `onerror` entra no
 * DOM. Como o catálogo é alimentado por planilha de terceiro, o dado chega sem
 * ninguém revisar célula por célula.
 *
 * Escapa `&` primeiro, senão as entidades geradas depois seriam re-escapadas.
 *
 * @param {any} valor
 * @returns {string}
 */
export function escapeHtml(valor) {
  if (valor === null || valor === undefined) {
    return '';
  }

  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
