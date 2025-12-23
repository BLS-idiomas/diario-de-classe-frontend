import { UpdateAndamentoAulaService } from './updateAndamentoAulaService';

// Mock AulaApi
const mockUpdateAndamento = jest.fn();
const MockAulaApi = jest.fn().mockImplementation(() => ({
  updateAndamento: mockUpdateAndamento,
}));

describe('UpdateAndamentoAulaService', () => {
  beforeEach(() => {
    mockUpdateAndamento.mockReset();
  });

  it('should call updateAndamento with correct params', async () => {
    const aulaApi = new MockAulaApi();
    const service = new UpdateAndamentoAulaService(aulaApi);
    const id = 1;
    const data = { andamento: 'novo' };
    mockUpdateAndamento.mockResolvedValue('ok');

    const result = await service.execute(id, data);
    expect(mockUpdateAndamento).toHaveBeenCalledWith(id, data);
    expect(result).toBe('ok');
  });

  it('static handle should instantiate and call execute', async () => {
    // Spy on execute
    const executeSpy = jest
      .spyOn(UpdateAndamentoAulaService.prototype, 'execute')
      .mockResolvedValue('handled');
    const id = 2;
    const data = { andamento: 'static' };
    const result = await UpdateAndamentoAulaService.handle(id, data);
    expect(executeSpy).toHaveBeenCalledWith(id, data);
    expect(result).toBe('handled');
    executeSpy.mockRestore();
  });
});
