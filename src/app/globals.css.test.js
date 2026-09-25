import fs from 'node:fs';
import path from 'node:path';

// BI-40: ícone nativo do seletor de data/hora ilegível no tema dark.
// jsdom não processa o pipeline do Tailwind (@layer/@apply/nesting nativo),
// então a prova combina duas pernas independentes:
// 1) inspeção textual do fonte real, com contagem de chaves e de
//    declarações `color-scheme` (não a primeira ocorrência, para não deixar
//    passar uma segunda regra solta), para garantir que existe exatamente
//    UMA declaração no bloco `[data-theme='dark']`, e que ela pertence à
//    regra composta `input[type='date']`/`input[type='time']` com
//    `.input-field` — nunca uma regra `.input-field` isolada, que afetaria
//    os outros inputs, e nunca fora do bloco dark;
// 2) verificação de estilo computado via jsdom, injetando no documento a
//    MESMA regra extraída do arquivo real (seletor e corpo vêm do fonte,
//    não de uma cópia manual) — prova que essa regra, tal como escrita em
//    produção, resolve `color-scheme: dark` no motor de CSS. Isso não prova
//    o ícone renderizado pelo user-agent (fora do alcance de jsdom); essa
//    ponta é papel do `screenVerify`/QA.

const cssPath = path.join(__dirname, 'globals.css');
const cssSource = fs.readFileSync(cssPath, 'utf8');

/**
 * Extrai o corpo (conteúdo entre chaves) do bloco cuja chave de abertura é
 * a primeira `{` a partir de `startIndex`, via contagem de chaves (não
 * regex ingênua, que quebraria em blocos aninhados).
 */
function extractBlockBodyAt(source, startIndex) {
  if (startIndex < 0) return null;
  const openBrace = source.indexOf('{', startIndex);
  if (openBrace === -1) return null;

  let depth = 1;
  let i = openBrace + 1;
  for (; i < source.length && depth > 0; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') depth--;
  }
  if (depth !== 0) return null;

  return {
    body: source.slice(openBrace + 1, i - 1),
    start: startIndex,
    end: i,
  };
}

/**
 * Extrai o corpo do bloco cujo texto de abertura é `openerLiteral` (deve
 * terminar em `{`), procurando a partir de `fromIndex`.
 */
function extractBlockBody(source, openerLiteral, fromIndex = 0) {
  const startOfOpener = source.indexOf(openerLiteral, fromIndex);
  return extractBlockBodyAt(source, startOfOpener);
}

/**
 * Extrai uma regra ancorada por `selectorAnchor` (início literal do seletor,
 * sem o `{`), devolvendo o texto completo do seletor (pode ser lista
 * separada por vírgula) e o corpo — delega a contagem de chaves a
 * `extractBlockBodyAt`, em vez de duplicá-la.
 */
function extractRuleBySelectorAnchor(source, selectorAnchor, fromIndex = 0) {
  const start = source.indexOf(selectorAnchor, fromIndex);
  if (start === -1) return null;
  const openBrace = source.indexOf('{', start);
  if (openBrace === -1) return null;
  const selectorText = source.slice(start, openBrace).trim();

  const block = extractBlockBodyAt(source, start);
  if (!block) return null;

  return { selectorText, ...block };
}

/**
 * Remove comentários de bloco CSS antes de qualquer contagem textual — sem
 * isso, o texto do próprio comentário explicativo (que cita
 * `color-scheme: dark` em prosa) inflaria a contagem de declarações reais.
 */
function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

describe('globals.css — ícone do seletor de data/hora no tema dark (BI-40)', () => {
  it("escopa color-scheme: dark somente dentro de [data-theme='dark'], mirando input[type='date']/input[type='time'] com .input-field", () => {
    const darkBlock = extractBlockBody(cssSource, "[data-theme='dark'] {");
    expect(darkBlock).not.toBeNull();

    const dateTimeIconRule = extractRuleBySelectorAnchor(
      darkBlock.body,
      "input[type='date'].input-field"
    );
    expect(dateTimeIconRule).not.toBeNull();
    expect(dateTimeIconRule.selectorText.replace(/\s+/g, ' ').trim()).toBe(
      "input[type='date'].input-field, input[type='time'].input-field"
    );
    expect(dateTimeIconRule.body.replace(/\s+/g, ' ').trim()).toBe(
      'color-scheme: dark;'
    );
  });

  it('tem exatamente UMA declaração color-scheme no bloco dark, e é a da regra composta de data/hora (não regressiona texto/select nem o tema light, nem tolera uma segunda regra solta vazando o efeito)', () => {
    const darkBlock = extractBlockBody(cssSource, "[data-theme='dark'] {");
    const dateTimeIconRule = extractRuleBySelectorAnchor(
      darkBlock.body,
      "input[type='date'].input-field"
    );

    // Contagem, não inspeção da primeira ocorrência: uma segunda regra
    // `.input-field { color-scheme: ...; }` solta no mesmo bloco vazaria o
    // efeito para todo input e só é pega comparando o total do bloco contra
    // o total dentro da própria regra composta.
    const darkBlockNoComments = stripCssComments(darkBlock.body);
    const colorSchemeDeclarationsInBlock =
      darkBlockNoComments.match(/color-scheme\s*:/g) || [];
    const colorSchemeDeclarationsInRule =
      dateTimeIconRule.body.match(/color-scheme\s*:/g) || [];

    expect(colorSchemeDeclarationsInBlock).toHaveLength(1);
    expect(colorSchemeDeclarationsInRule).toHaveLength(1);
    expect(colorSchemeDeclarationsInBlock.length).toBe(
      colorSchemeDeclarationsInRule.length
    );

    // Fora do bloco [data-theme='dark'] (tema light) também não há
    // color-scheme algum associado a input de data/hora. Lookbehind negativo
    // exclui `prefers-color-scheme` (nome da media feature usada pelo
    // mecanismo de 3 estados de tema, DEC-002-004, dentro do bloco
    // `[data-theme='system']`) — colisão de substring com a declaração
    // `color-scheme:` real que este teste vigia, não um vazamento do efeito.
    const outsideDarkBlock =
      cssSource.slice(0, darkBlock.start) + cssSource.slice(darkBlock.end);
    expect(outsideDarkBlock).not.toMatch(/(?<!prefers-)color-scheme\s*:/);
  });

  it('resolve color-scheme: dark, com a regra extraída do fonte real, no input de data/hora quando o tema dark está ativo — e nada no tema light nem em outros tipos de input', () => {
    const darkBlock = extractBlockBody(cssSource, "[data-theme='dark'] {");
    const dateTimeIconRule = extractRuleBySelectorAnchor(
      darkBlock.body,
      "input[type='date'].input-field"
    );

    // Escopa CADA seletor da lista sob [data-theme='dark'] individualmente
    // (equivalente ao que o nesting do Tailwind produziria ao compilar:
    // `[data-theme='dark'] A, [data-theme='dark'] B`, nunca
    // `[data-theme='dark'] A, B` — a segunda forma vazaria B para fora do
    // escopo do tema).
    const scopedSelectors = dateTimeIconRule.selectorText
      .split(',')
      .map(part => `[data-theme='dark'] ${part.trim()}`)
      .join(', ');

    const style = document.createElement('style');
    style.textContent = `${scopedSelectors} { ${dateTimeIconRule.body.trim()} }`;
    document.head.appendChild(style);

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'input-field';
    document.body.appendChild(dateInput);

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.className = 'input-field';
    document.body.appendChild(timeInput);

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.className = 'input-field';
    document.body.appendChild(textInput);

    document.documentElement.setAttribute('data-theme', 'light');
    expect(getComputedStyle(dateInput).colorScheme).toBe('');
    expect(getComputedStyle(timeInput).colorScheme).toBe('');

    document.documentElement.setAttribute('data-theme', 'dark');
    expect(getComputedStyle(dateInput).colorScheme).toBe('dark');
    expect(getComputedStyle(timeInput).colorScheme).toBe('dark');
    expect(getComputedStyle(textInput).colorScheme).toBe('');

    document.head.removeChild(style);
    document.body.removeChild(dateInput);
    document.body.removeChild(timeInput);
    document.body.removeChild(textInput);
    document.documentElement.removeAttribute('data-theme');
  });
});

// AC-001-009/DEC-002-004: a área de toque mínima (44px) de todos os
// consumidores (`Table/index.jsx`, `.tap-target` aqui mesmo,
// `datatable-dark.css`) depende de UM único ponto de verdade —
// `--tap-target-size`, declarada no bloco `:root`. Os consumidores só
// asserem a indireção (`var(--tap-target-size)`); sem este teste, um typo
// no nome da variável ou a remoção/alteração do valor no `:root` derrubaria
// a área de toque nos 12 consumidores com a suíte inteira verde.
describe('globals.css — --tap-target-size (DEC-002-004)', () => {
  it('declara --tap-target-size: 2.75rem no bloco :root', () => {
    const rootBlock = extractBlockBody(cssSource, ':root {');
    expect(rootBlock).not.toBeNull();
    expect(rootBlock.body.replace(/\s+/g, ' ')).toContain(
      '--tap-target-size: 2.75rem;'
    );
  });
});
