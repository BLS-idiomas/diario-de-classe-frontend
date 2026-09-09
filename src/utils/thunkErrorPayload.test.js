import { thunkErrorPayload } from './thunkErrorPayload';

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

  it('cai na mensagem do erro quando a API não manda uma', () => {
    const error = { message: 'Network Error' };

    expect(thunkErrorPayload(error, 'fallback').message).toBe('Network Error');
  });

  it('usa o fallback quando não há nenhuma mensagem', () => {
    expect(thunkErrorPayload({}, 'Erro ao buscar livros').message).toBe(
      'Erro ao buscar livros'
    );
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
