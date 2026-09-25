import { getAlunos } from './alunosSlice';
import { GetAlunoListService } from '@/services/aluno/getAlunoListService';

jest.mock('@/services/aluno/getAlunoListService');

const SEM_CONEXAO_MESSAGE =
  'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.';

function findRejected(dispatch) {
  const call = dispatch.mock.calls.find(
    ([action]) => action.type === getAlunos.rejected.type
  );
  return call?.[0];
}

describe('alunosSlice - mensagem de erro do thunk getAlunos', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa a mensagem fixa de conexão quando a chamada falha sem response (rede)', async () => {
    GetAlunoListService.handle.mockRejectedValue({
      message: 'Network Error',
    });

    const dispatch = jest.fn();
    await getAlunos()(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe(SEM_CONEXAO_MESSAGE);
  });

  it('propaga a mensagem do servidor quando error.response.data.message existe', async () => {
    GetAlunoListService.handle.mockRejectedValue({
      response: { status: 500, data: { message: 'Falha ao listar alunos' } },
    });

    const dispatch = jest.fn();
    await getAlunos()(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe('Falha ao listar alunos');
  });
});
