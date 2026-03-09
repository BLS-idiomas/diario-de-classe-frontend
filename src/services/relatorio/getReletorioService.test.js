import { GetRelatorioService } from './getReletorioService';

describe('GetRelatorioService', () => {
  let relatorioApi;
  let service;

  beforeEach(() => {
    relatorioApi = { getAll: jest.fn() };
    service = new GetRelatorioService(relatorioApi);
  });

  it('deve chamar relatorioApi.getAll ao executar', async () => {
    relatorioApi.getAll.mockResolvedValue(['relatorio1', 'relatorio2']);
    const result = await service.execute();
    expect(relatorioApi.getAll).toHaveBeenCalled();
    expect(result).toEqual(['relatorio1', 'relatorio2']);
  });
});
