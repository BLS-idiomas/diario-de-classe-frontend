import { DownloadCronogramaExcelService } from './downloadCronogramaExcelService';

describe('DownloadCronogramaExcelService', () => {
  const mockApi = { downloadCronogramaExcel: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama downloadCronogramaExcel repassando o argumento', async () => {
    const service = new DownloadCronogramaExcelService(mockApi);
    mockApi.downloadCronogramaExcel.mockResolvedValue('ok');

    const result = await service.execute('aluno-1');

    expect(mockApi.downloadCronogramaExcel).toHaveBeenCalledWith('aluno-1');
    expect(result).toBe('ok');
  });

  it('propaga erro do api', async () => {
    const service = new DownloadCronogramaExcelService(mockApi);
    mockApi.downloadCronogramaExcel.mockRejectedValue(new Error('falhou'));

    await expect(service.execute('aluno-1')).rejects.toThrow('falhou');
  });
});
