import { thunkErrorPayload, getRequestErrorMessage } from './thunkErrorPayload';

describe('thunkErrorPayload', () => {
  it('prefere a mensagem da API', () => {
    const error = {
      response: { status: 422, data: { message: 'Nível inválido' } },
      message: 'Request failed',
    };

    expect(thunkErrorPayload(error, 'fallback')).toEqual({
      message: 'Nível inválido',
      errors: [],
      statusError: 422,
    });
  });

  it('cai na mensagem do erro quando a API responde sem uma mensagem', () => {
    const error = { response: { status: 500, data: {} }, message: 'x' };

    expect(thunkErrorPayload(error, 'fallback').message).toBe('x');
  });

  it('usa a mensagem fixa de conexão quando não há response (falha de rede)', () => {
    const error = { message: 'Network Error' };

    expect(thunkErrorPayload(error, 'fallback').message).toBe(
      'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.'
    );
  });

  it('usa o fallback quando a API responde sem mensagem nem error.message', () => {
    expect(
      thunkErrorPayload({ response: { data: {} } }, 'Erro ao buscar livros')
        .message
    ).toBe('Erro ao buscar livros');
  });

  it('repassa a lista de erros de validação', () => {
    const error = {
      response: { status: 422, data: { errors: ['nome: obrigatório'] } },
    };

    expect(thunkErrorPayload(error, 'fallback').errors).toEqual([
      'nome: obrigatório',
    ]);
  });

  it('deixa statusError undefined sem response', () => {
    expect(
      thunkErrorPayload({ message: 'x' }, 'f').statusError
    ).toBeUndefined();
  });
});

describe('getRequestErrorMessage', () => {
  it('retorna a mensagem fixa de conexão quando não há response', () => {
    const error = { message: 'Network Error' };

    expect(getRequestErrorMessage(error, 'fallback')).toBe(
      'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.'
    );
  });

  it('propaga a mensagem da API quando há response com data.message', () => {
    const error = {
      response: { status: 422, data: { message: 'Nível inválido' } },
    };

    expect(getRequestErrorMessage(error, 'fallback')).toBe('Nível inválido');
  });
});
