import {
  validarConfiguracao,
  mapearErroServidorPorCampo,
} from './validarConfiguracao';

const DIAS_SEMANA = [
  'SEGUNDA',
  'TERCA',
  'QUARTA',
  'QUINTA',
  'SEXTA',
  'SABADO',
  'DOMINGO',
];

const diaValido = diaSemana => ({
  diaSemana,
  ativo: true,
  horaInicial: '08:00',
  horaFinal: '18:00',
});

// Fixture no tipo do contrato: duracaoAula/tolerancia number, como a API devolve
// (Prisma Int) — os casos que testam o eixo do tipo usam string à parte, como o
// `InputField` entrega via handleChange.
function criarFormDataValido() {
  return {
    duracaoAula: 50,
    tolerancia: 10,
    diasDeFuncionamento: DIAS_SEMANA.map(diaValido),
  };
}

describe('validarConfiguracao — duracaoAula/tolerancia', () => {
  describe.each(['duracaoAula', 'tolerancia'])('campo %s', campo => {
    it.each([
      ['vazio — string digitada', '', 'Campo obrigatório'],
      ['vazio — ausente', undefined, 'Campo obrigatório'],
      ['não numérico — string digitada', 'abc', 'Deve ser um número válido'],
      ['zero — number vindo da API', 0, 'Não pode ser zero'],
      ['zero — string digitada', '0', 'Não pode ser zero'],
      ['negativo — number vindo da API', -5, 'Deve ser um número positivo'],
      ['negativo — string digitada', '-5', 'Deve ser um número positivo'],
    ])('%s → mensagem no campo', (_descricao, valor, mensagemEsperada) => {
      const formData = criarFormDataValido();
      formData[campo] = valor;

      const resultado = validarConfiguracao(formData);

      expect(resultado[campo]).toBe(mensagemEsperada);
    });

    it('valor-limite válido (1) não gera erro', () => {
      const formData = criarFormDataValido();
      formData[campo] = 1;

      const resultado = validarConfiguracao(formData);

      expect(resultado[campo]).toBeUndefined();
    });

    it('valor válido digitado como string não gera erro', () => {
      const formData = criarFormDataValido();
      formData[campo] = '45';

      const resultado = validarConfiguracao(formData);

      expect(resultado[campo]).toBeUndefined();
    });
  });
});

describe('validarConfiguracao — diasDeFuncionamento', () => {
  function validarUmDia(overrides) {
    const formData = criarFormDataValido();
    formData.diasDeFuncionamento = [{ ...diaValido('SEGUNDA'), ...overrides }];
    return validarConfiguracao(formData).diasDeFuncionamento.SEGUNDA;
  }

  const MSG_FORMATO = 'Informe um horário no formato HH:MM.';
  const MSG_ORDEM = 'A hora final deve ser maior que a hora inicial.';
  const MSG_ATIVAR = 'Ative o dia para corrigir as horas.';

  it.each([
    [
      'horaInicial fora do formato HH:MM — dia ativo',
      { ativo: true, horaInicial: '8:00' },
      { horaInicial: MSG_FORMATO, horaFinal: undefined },
    ],
    [
      'horaInicial fora do formato HH:MM — dia inativo',
      { ativo: false, horaInicial: '8:00' },
      { horaInicial: MSG_ATIVAR, horaFinal: undefined },
    ],
    [
      'horaFinal fora do formato HH:MM — dia ativo',
      { ativo: true, horaFinal: '25:00' },
      { horaInicial: undefined, horaFinal: MSG_FORMATO },
    ],
    [
      'horaFinal fora do formato HH:MM — dia inativo',
      { ativo: false, horaFinal: '25:00' },
      { horaInicial: undefined, horaFinal: MSG_ATIVAR },
    ],
    [
      'horaFinal igual à horaInicial — dia ativo',
      { ativo: true, horaInicial: '10:00', horaFinal: '10:00' },
      { horaInicial: undefined, horaFinal: MSG_ORDEM },
    ],
    [
      'horaFinal igual à horaInicial — dia inativo',
      { ativo: false, horaInicial: '10:00', horaFinal: '10:00' },
      { horaInicial: undefined, horaFinal: MSG_ATIVAR },
    ],
    [
      'horaFinal menor que horaInicial — dia ativo',
      { ativo: true, horaInicial: '10:00', horaFinal: '09:00' },
      { horaInicial: undefined, horaFinal: MSG_ORDEM },
    ],
    [
      'horaFinal menor que horaInicial — dia inativo',
      { ativo: false, horaInicial: '10:00', horaFinal: '09:00' },
      { horaInicial: undefined, horaFinal: MSG_ATIVAR },
    ],
  ])('%s', (_descricao, overrides, esperado) => {
    expect(validarUmDia(overrides)).toEqual(esperado);
  });

  it('valor-limite válido (00:00 → 00:01) não gera erro', () => {
    expect(validarUmDia({ horaInicial: '00:00', horaFinal: '00:01' })).toEqual({
      horaInicial: undefined,
      horaFinal: undefined,
    });
  });

  it('sem indicar outro dia: só o dia com inconsistência recebe mensagem (AC-001-007)', () => {
    const formData = criarFormDataValido();
    formData.diasDeFuncionamento = [
      { ...diaValido('SEGUNDA') },
      { ...diaValido('TERCA'), horaFinal: '07:00' }, // ordem invertida só na TERCA
      { ...diaValido('QUARTA') },
    ];

    const resultado = validarConfiguracao(formData);

    expect(resultado.diasDeFuncionamento.SEGUNDA).toEqual({
      horaInicial: undefined,
      horaFinal: undefined,
    });
    expect(resultado.diasDeFuncionamento.TERCA).toEqual({
      horaInicial: undefined,
      horaFinal: MSG_ORDEM,
    });
    expect(resultado.diasDeFuncionamento.QUARTA).toEqual({
      horaInicial: undefined,
      horaFinal: undefined,
    });
  });
});

describe('validarConfiguracao — caso válido', () => {
  it('todos os campos corretos → duracaoAula/tolerancia e todos os 7 dias undefined', () => {
    const resultado = validarConfiguracao(criarFormDataValido());

    expect(resultado.duracaoAula).toBeUndefined();
    expect(resultado.tolerancia).toBeUndefined();
    DIAS_SEMANA.forEach(diaSemana => {
      expect(resultado.diasDeFuncionamento[diaSemana]).toEqual({
        horaInicial: undefined,
        horaFinal: undefined,
      });
    });
  });
});

describe('mapearErroServidorPorCampo', () => {
  it('mapeia "duracaoAula: <mensagem>" para o campo duracaoAula', () => {
    const resultado = mapearErroServidorPorCampo([
      'duracaoAula: Deve ser um número positivo',
    ]);

    expect(resultado.duracaoAula).toBe('Deve ser um número positivo');
  });

  it('mapeia "tolerancia: <mensagem>" para o campo tolerancia', () => {
    const resultado = mapearErroServidorPorCampo([
      'tolerancia: Não pode ser zero',
    ]);

    expect(resultado.tolerancia).toBe('Não pode ser zero');
  });

  it('erro de diasDeFuncionamento sem indicação de dia não é mapeado (permanece genérico)', () => {
    const resultado = mapearErroServidorPorCampo([
      'diasDeFuncionamento: Contém horaInicial inválido',
    ]);

    expect(resultado.duracaoAula).toBeUndefined();
    expect(resultado.tolerancia).toBeUndefined();
    expect(resultado.diasDeFuncionamento).toBeUndefined();
  });

  it('sem errors (chamado sem argumento) devolve objeto vazio, sem lançar', () => {
    expect(mapearErroServidorPorCampo()).toEqual({});
  });

  it('array vazio devolve objeto vazio', () => {
    expect(mapearErroServidorPorCampo([])).toEqual({});
  });

  describe('errors fora do contrato — tolerado, nunca lança', () => {
    it('errors como string (não-array) devolve objeto vazio', () => {
      expect(
        mapearErroServidorPorCampo('duracaoAula: Campo obrigatório')
      ).toEqual({});
    });

    it('errors como objeto (não-array) devolve objeto vazio', () => {
      expect(
        mapearErroServidorPorCampo({ duracaoAula: 'Campo obrigatório' })
      ).toEqual({});
    });

    it('item não-string dentro do array é ignorado, os demais itens válidos continuam mapeados', () => {
      expect(
        mapearErroServidorPorCampo([42, 'duracaoAula: Campo obrigatório'])
      ).toEqual({ duracaoAula: 'Campo obrigatório' });
    });
  });
});
