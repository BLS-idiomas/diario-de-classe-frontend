import { RelatorioApi } from './relatorioApi';

describe('RelatorioApi', () => {
  let api;

  beforeEach(() => {
    api = new RelatorioApi();
  });

  it('deve retornar o endpoint correto', () => {
    expect(api.getEndpoint()).toBe('/relatorios');
  });

  it('deve chamar getByReport com o report correto', async () => {
    const report = 'mensal';
    const params = { ano: 2024 };
    const expectedUrl = '/relatorios/mensal';
    const expectedParams = params;
    api.get = jest.fn();
    await api.getByReport(report, params);
    expect(api.get).toHaveBeenCalledWith(expectedUrl, expectedParams);
  });

  it('deve lançar erro ao chamar getById', async () => {
    await expect(api.getById(1)).rejects.toThrow(
      'Operação de getById não é permitida para Relatório'
    );
  });

  it('deve lançar erro ao chamar update', async () => {
    await expect(api.update({})).rejects.toThrow(
      'Operação de update não é permitida para Relatório'
    );
  });

  it('deve lançar erro ao chamar create', async () => {
    await expect(api.create({})).rejects.toThrow(
      'Operação de create não é permitida para Relatório'
    );
  });

  it('deve lançar erro ao chamar delete', async () => {
    await expect(api.delete(1)).rejects.toThrow(
      'Operação de delete não é permitida para Relatório'
    );
  });
});
