import { UpdateConfiguracaoService } from './updateConfiguracaoService';

describe('UpdateConfiguracaoService', () => {
  const mockConfiguracaoApi = { update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call configuracaoApi.update with data', async () => {
    const service = new UpdateConfiguracaoService(mockConfiguracaoApi);
    mockConfiguracaoApi.update.mockResolvedValue('updated');
    const data = { foo: 'bar' };
    const result = await service.execute(data);
    expect(mockConfiguracaoApi.update).toHaveBeenCalledWith(data);
    expect(result).toBe('updated');
  });
});
