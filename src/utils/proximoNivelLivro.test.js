import { proximoNivelLivro } from './proximoNivelLivro';

describe('proximoNivelLivro', () => {
  const livros = [
    { idioma: 'INGLES', nivel: 1 },
    { idioma: 'INGLES', nivel: 3 },
    { idioma: 'ESPANHOL', nivel: 7 },
  ];

  it('devolve o maior nível do idioma mais um', () => {
    expect(proximoNivelLivro(livros, 'INGLES')).toBe(4);
  });

  it('conta apenas o idioma pedido, e não o catálogo inteiro', () => {
    // `nivel` é a ordem do livro na trilha do idioma.
    expect(proximoNivelLivro(livros, 'ESPANHOL')).toBe(8);
  });

  it('começa em 1 quando o idioma não tem livro', () => {
    expect(proximoNivelLivro(livros, 'FRANCES')).toBe(1);
  });

  it('começa em 1 com catálogo vazio', () => {
    expect(proximoNivelLivro([], 'INGLES')).toBe(1);
  });

  it('ignora livro sem nível', () => {
    expect(
      proximoNivelLivro(
        [
          { idioma: 'INGLES', nivel: null },
          { idioma: 'INGLES', nivel: 2 },
        ],
        'INGLES'
      )
    ).toBe(3);
  });

  it('começa em 1 quando todos os livros do idioma estão sem nível', () => {
    expect(
      proximoNivelLivro([{ idioma: 'INGLES', nivel: null }], 'INGLES')
    ).toBe(1);
  });

  it('aceita nível vindo como string numérica', () => {
    expect(
      proximoNivelLivro([{ idioma: 'INGLES', nivel: '4' }], 'INGLES')
    ).toBe(5);
  });

  it.each([null, undefined, 'nao-array'])(
    'devolve 1 para lista inválida (%p)',
    lista => {
      expect(proximoNivelLivro(lista, 'INGLES')).toBe(1);
    }
  );

  it('devolve 1 sem idioma', () => {
    expect(proximoNivelLivro(livros, null)).toBe(1);
  });
});
