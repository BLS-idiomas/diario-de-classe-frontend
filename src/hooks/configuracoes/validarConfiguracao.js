// Espelha (client-side) as regras de
// diario-de-classe-backend/src/middlewares/configuracao/validateUpdateConfiguracao.js:14-90
// (DEC-002-001: backend intocado):
// - duracaoAula/tolerancia: ValidateData.require().isNumber().isPositive().notZero() —
//   literais em `validateData.js` (isNumber:56-67, isPositive:283-297, notZero:312-326).
// - diasDeFuncionamento: regex `^([01]\d|2[0-3]):([0-5]\d)$` (horaInicialIsValid:50,
//   horaFinalIsValid:58) e a comparação `toMinutes` (horaFinalIsValid:59-61) — o backend
//   valida os 7 dias independente de `ativo` (horaFinalIsValid/horasIsValid não leem
//   `ativo`); a orientação de ativar o dia é regra de apresentação do FR-001-017, não do
//   middleware.

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MENSAGEM_CAMPO_OBRIGATORIO = 'Campo obrigatório';
const MENSAGEM_NAO_NUMERICO = 'Deve ser um número válido';
const MENSAGEM_NAO_POSITIVO = 'Deve ser um número positivo';
const MENSAGEM_ZERO = 'Não pode ser zero';
const MENSAGEM_FORMATO_HORA = 'Informe um horário no formato HH:MM.';
const MENSAGEM_ORDEM_HORA = 'A hora final deve ser maior que a hora inicial.';
const MENSAGEM_ATIVAR_DIA = 'Ative o dia para corrigir as horas.';

function toMinutes(hora) {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Mensagem de erro ou `undefined` para `duracaoAula`/`tolerancia` — mesma sequência de
 * regras de `ValidateData.require().isNumber().isPositive().notZero()`. `valor` chega ora
 * como number (lido da API, contrato Prisma Int), ora como string (digitado no
 * `InputField`) — `Number(valor)` cobre os dois tipos.
 */
function validarNumeroPositivo(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return MENSAGEM_CAMPO_OBRIGATORIO;
  }

  const numero = Number(valor);

  if (isNaN(numero)) {
    return MENSAGEM_NAO_NUMERICO;
  }

  if (numero === 0) {
    return MENSAGEM_ZERO;
  }

  if (numero < 0) {
    return MENSAGEM_NAO_POSITIVO;
  }

  return undefined;
}

/**
 * Mensagens de erro (`{ horaInicial, horaFinal }`, cada uma mensagem ou `undefined`) para
 * um dia de `diasDeFuncionamento`. O backend valida os 7 dias independente de `ativo`
 * (FR-001-013); quando o dia está inativo, a mensagem em cada campo com inconsistência é
 * substituída pela orientação de ativar o dia (FR-001-017), nunca a mensagem de
 * formato/ordem — dia já ativo não recebe essa orientação (não faz sentido pedir para
 * ativar o que já está ativo).
 */
function validarDia({ ativo, horaInicial, horaFinal }) {
  const horaInicialFormatoValido =
    typeof horaInicial === 'string' && HORA_REGEX.test(horaInicial);
  const horaFinalFormatoValido =
    typeof horaFinal === 'string' && HORA_REGEX.test(horaFinal);

  let erroHoraInicial = horaInicialFormatoValido
    ? undefined
    : MENSAGEM_FORMATO_HORA;
  let erroHoraFinal = horaFinalFormatoValido
    ? undefined
    : MENSAGEM_FORMATO_HORA;

  if (
    horaInicialFormatoValido &&
    horaFinalFormatoValido &&
    toMinutes(horaFinal) <= toMinutes(horaInicial)
  ) {
    erroHoraFinal = MENSAGEM_ORDEM_HORA;
  }

  if (!ativo && (erroHoraInicial || erroHoraFinal)) {
    return {
      horaInicial: erroHoraInicial ? MENSAGEM_ATIVAR_DIA : undefined,
      horaFinal: erroHoraFinal ? MENSAGEM_ATIVAR_DIA : undefined,
    };
  }

  return { horaInicial: erroHoraInicial, horaFinal: erroHoraFinal };
}

/**
 * Validação client-side de `formData` (COMP-002-003) — mesmo shape de erro por
 * campo/dia que os `InputField` da tela consomem: mensagem ou `undefined`.
 *
 * @param {object} formData
 * @returns {{ duracaoAula: string|undefined, tolerancia: string|undefined,
 *   diasDeFuncionamento: Record<string, { horaInicial: string|undefined, horaFinal:
 *   string|undefined }> }}
 */
export function validarConfiguracao(formData) {
  const diasDeFuncionamento = {};

  (formData.diasDeFuncionamento || []).forEach(dia => {
    diasDeFuncionamento[dia.diaSemana] = validarDia(dia);
  });

  return {
    duracaoAula: validarNumeroPositivo(formData.duracaoAula),
    tolerancia: validarNumeroPositivo(formData.tolerancia),
    diasDeFuncionamento,
  };
}

/**
 * Mapeia `errors` do servidor (formato já existente, `validateData.js:361-373`:
 * `${fieldName}: ${message}`) para o campo específico quando o prefixo é `duracaoAula` ou
 * `tolerancia`. Erro de `diasDeFuncionamento` (sempre prefixado `diasDeFuncionamento:` —
 * o middleware valida o array inteiro, sem indicar o dia, RISK-001-002) não é mapeado:
 * permanece no `FormError` genérico, sem mudança (FR-001-020).
 *
 * `errors` fora do contrato (não-array, ou item que não é string) é tolerado: item
 * inválido é ignorado, `errors` não-array devolve mapa vazio — nunca lança.
 *
 * @param {string[]} errors
 * @returns {{ duracaoAula?: string, tolerancia?: string }}
 */
export function mapearErroServidorPorCampo(errors = []) {
  if (!Array.isArray(errors)) return {};

  const CAMPOS_MAPEAVEIS = ['duracaoAula', 'tolerancia'];
  const mapa = {};

  errors.forEach(erro => {
    if (typeof erro !== 'string') return;

    const indiceSeparador = erro.indexOf(': ');
    if (indiceSeparador === -1) return;

    const prefixo = erro.slice(0, indiceSeparador);
    if (!CAMPOS_MAPEAVEIS.includes(prefixo)) return;

    mapa[prefixo] = erro.slice(indiceSeparador + 2);
  });

  return mapa;
}
