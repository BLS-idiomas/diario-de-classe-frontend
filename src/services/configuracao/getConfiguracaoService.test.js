import { GetConfiguracaoService } from './getConfiguracaoService';

describe('GetConfiguracaoService', () => {
  const mockConfiguracaoApi = { getAll: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call configuracaoApi.getAll', async () => {
    const service = new GetConfiguracaoService(mockConfiguracaoApi);
    mockConfiguracaoApi.getAll.mockResolvedValue(['conf1', 'conf2']);
    const result = await service.execute();
    expect(mockConfiguracaoApi.getAll).toHaveBeenCalled();
    expect(result).toEqual(['conf1', 'conf2']);
  });
});
