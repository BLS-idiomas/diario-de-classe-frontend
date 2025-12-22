import { CreateAulaService } from './createAulaService';

describe('CreateAulaService', () => {
  const mockAulaApi = { create: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call aulaApi.create with data', async () => {
    const service = new CreateAulaService(mockAulaApi);
    const data = { nome: 'Aula 1' };
    mockAulaApi.create.mockResolvedValue('created');
    const result = await service.execute(data);
    expect(mockAulaApi.create).toHaveBeenCalledWith(data);
    expect(result).toBe('created');
  });
});
