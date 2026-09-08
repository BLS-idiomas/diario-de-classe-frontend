import { GetCronogramaByAlunoService } from './getCronogramaByAlunoService';

describe('GetCronogramaByAlunoService', () => {
  const mockApi = { getCronogramaByAluno: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama getCronogramaByAluno repassando o argumento', async () => {
    const service = new GetCronogramaByAlunoService(mockApi);
    mockApi.getCronogramaByAluno.mockResolvedValue('ok');

    const result = await service.execute('aluno-1');

    expect(mockApi.getCronogramaByAluno).toHaveBeenCalledWith('aluno-1');
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new GetCronogramaByAlunoService(mockApi);
    mockApi.getCronogramaByAluno.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('aluno-1')).rejects.toThrow('falhou');
  });
});
