import { GetRelatorioByReportService } from './getRelatorioByReportService';

describe('GetRelatorioByReportService', () => {
  let relatorioApi;
  let service;

  beforeEach(() => {
    relatorioApi = { getByReport: jest.fn() };
    service = new GetRelatorioByReportService(relatorioApi);
  });

  it('deve chamar relatorioApi.getByReport ao executar', async () => {
    const report = 'mensal';
    const params = { ano: 2024 };
    relatorioApi.getByReport.mockResolvedValue(['relatorio1', 'relatorio2']);
    const result = await service.execute(report, params);
    expect(relatorioApi.getByReport).toHaveBeenCalledWith(report, params);
    expect(result).toEqual(['relatorio1', 'relatorio2']);
  });
});
