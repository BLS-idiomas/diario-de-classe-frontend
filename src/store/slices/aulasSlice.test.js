import aulasReducer, { getAulas, updateAula } from './aulasSlice';
import { GetAulaListService } from '@/services/aula/getAulaListService';
import { UpdateAulaService } from '@/services/aula/updateAulaService';
import { STATUS } from '@/constants';

jest.mock('@/services/aula/getAulaListService');
jest.mock('@/services/aula/updateAulaService');

const SEM_CONEXAO_MESSAGE =
  'Não foi possível concluir a ação. Verifique sua conexão com a internet e tente novamente.';

function findRejected(dispatch) {
  const call = dispatch.mock.calls.find(
    ([action]) => action.type === getAulas.rejected.type
  );
  return call?.[0];
}

function findRejectedFor(dispatch, thunk) {
  const call = dispatch.mock.calls.find(
    ([action]) => action.type === thunk.rejected.type
  );
  return call?.[0];
}

describe('aulasSlice - mensagem de erro do thunk getAulas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa a mensagem fixa de conexão quando a chamada falha sem response (rede)', async () => {
    GetAulaListService.handle.mockRejectedValue({ message: 'Network Error' });

    const dispatch = jest.fn();
    await getAulas()(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe(SEM_CONEXAO_MESSAGE);
  });

  it('propaga a mensagem do servidor quando error.response.data.message existe', async () => {
    GetAulaListService.handle.mockRejectedValue({
      response: { status: 422, data: { message: 'Parâmetro inválido' } },
    });

    const dispatch = jest.fn();
    await getAulas()(dispatch, () => ({}), undefined);

    const rejected = findRejected(dispatch);
    expect(rejected.payload.message).toBe('Parâmetro inválido');
  });
});

describe('aulasSlice - mensagem de erro do thunk updateAula (gravação)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('usa a mensagem fixa de conexão quando a chamada falha sem response (rede)', async () => {
    UpdateAulaService.handle.mockRejectedValue({ message: 'Network Error' });

    const dispatch = jest.fn();
    await updateAula({ id: 1, data: {} })(dispatch, () => ({}), undefined);

    const rejected = findRejectedFor(dispatch, updateAula);
    expect(rejected.payload.message).toBe(SEM_CONEXAO_MESSAGE);

    const state = aulasReducer(undefined, rejected);
    expect(state.status).toBe(STATUS.FAILED);
    expect(state.message).toBe(SEM_CONEXAO_MESSAGE);
  });

  it('propaga a mensagem do servidor quando error.response.data.message existe', async () => {
    UpdateAulaService.handle.mockRejectedValue({
      response: { status: 422, data: { message: 'Aula não encontrada' } },
    });

    const dispatch = jest.fn();
    await updateAula({ id: 1, data: {} })(dispatch, () => ({}), undefined);

    const rejected = findRejectedFor(dispatch, updateAula);
    expect(rejected.payload.message).toBe('Aula não encontrada');
  });
});
