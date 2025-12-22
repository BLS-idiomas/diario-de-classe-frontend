import { GetAulasByProfessorService } from './getAulasByProfessorService';

describe('GetAulasByProfessorService', () => {
  it('deve chamar professorApi.getAulasByProfessor no método execute', async () => {
    const mockApi = {
      getAulasByProfessor: jest.fn(async id => ({ aulas: ['Aula1'], id })),
    };
    const service = new GetAulasByProfessorService(mockApi);
    const result = await service.execute(42);
    expect(mockApi.getAulasByProfessor).toHaveBeenCalledWith(42);
    expect(result).toEqual({ aulas: ['Aula1'], id: 42 });
  });
});
