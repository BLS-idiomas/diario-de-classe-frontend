import { UpdateAulaService } from './updateAulaService';

describe('UpdateAulaService', () => {
  const mockAulaApi = { update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call aulaApi.update with id and data', async () => {
    const service = new UpdateAulaService(mockAulaApi);
    mockAulaApi.update.mockResolvedValue('updated');
    const result = await service.execute(3, { nome: 'Aula Editada' });
    expect(mockAulaApi.update).toHaveBeenCalledWith(3, {
      nome: 'Aula Editada',
    });
    expect(result).toBe('updated');
  });
});
