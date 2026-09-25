import { updateConfiguracao } from './configuracaoSlice';
import { UpdateConfiguracaoService } from '@/services/configuracao/updateConfiguracaoService';

jest.mock('@/services/configuracao/updateConfiguracaoService');

const SEM_CONEXAO_MESSAGE =
  'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.';

function findRejected(dispatch) {
  const call = dispatch.mock.calls.find(
    ([action]) => action.type === updateConfiguracao.rejected.type
  );
  return call?.[0];
}

describe('configuracaoSlice - mensagem de erro do thunk updateConfiguracao (gravação)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa a mensagem fixa de conexão quando a chamada falha sem response (rede)', async () => {
    UpdateConfiguracaoService.handle.mockRejectedValue({
      message: 'Network Error',
    });

    const dispatch = jest.fn();
    await updateConfiguracao({})(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe(SEM_CONEXAO_MESSAGE);
  });

  it('propaga a mensagem do servidor quando error.response.data.message existe', async () => {
    UpdateConfiguracaoService.handle.mockRejectedValue({
      response: { status: 422, data: { message: 'Configuração inválida' } },
    });

    const dispatch = jest.fn();
    await updateConfiguracao({})(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe('Configuração inválida');
  });
});
