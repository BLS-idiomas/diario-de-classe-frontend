import { UpdateDisponibilidadeProfessorService } from './updateDisponibilidadeProfessorService';

describe('UpdateDisponibilidadeProfessorService', () => {
  it('deve chamar professorApi.updateDisponibilidade no método execute', async () => {
    const mockApi = {
      updateDisponibilidade: jest.fn(async (id, data) => ({
        updated: true,
        id,
        data,
      })),
    };
    const service = new UpdateDisponibilidadeProfessorService(mockApi);
    const result = await service.execute(42, { dias: ['segunda'] });
    expect(mockApi.updateDisponibilidade).toHaveBeenCalledWith(42, {
      dias: ['segunda'],
    });
    expect(result).toEqual({
      updated: true,
      id: 42,
      data: { dias: ['segunda'] },
    });
  });
});
