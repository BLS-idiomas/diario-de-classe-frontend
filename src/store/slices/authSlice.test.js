import { login } from './authSlice';
import { LoiginService } from '@/services/auth/loginService';

jest.mock('@/services/auth/loginService');

const SEM_CONEXAO_MESSAGE =
  'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.';

function findRejected(dispatch) {
  const call = dispatch.mock.calls.find(
    ([action]) => action.type === login.rejected.type
  );
  return call?.[0];
}

describe('authSlice - mensagem de erro do thunk login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa a mensagem fixa de conexão quando a chamada falha sem response (rede)', async () => {
    LoiginService.handle.mockRejectedValue({ message: 'Network Error' });

    const dispatch = jest.fn();
    await login({ email: 'a@a.com', senha: '123' })(
      dispatch,
      () => ({}),
      undefined
    );

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe(SEM_CONEXAO_MESSAGE);
  });

  it('propaga a mensagem do servidor quando error.response.data.message existe', async () => {
    LoiginService.handle.mockRejectedValue({
      response: { status: 401, data: { message: 'Credenciais inválidas' } },
    });

    const dispatch = jest.fn();
    await login({ email: 'a@a.com', senha: '123' })(
      dispatch,
      () => ({}),
      undefined
    );

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe('Credenciais inválidas');
  });
});
