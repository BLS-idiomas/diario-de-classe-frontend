import { GetAlunosByProfessorService } from './getAlunosByProfessorService';

describe('GetAlunosByProfessorService', () => {
  it('deve chamar professorApi.getAlunosByProfessor no método execute', async () => {
    const mockApi = {
      getAlunosByProfessor: jest.fn(async id => ({ alunos: ['Aluno1'], id })),
    };
    const service = new GetAlunosByProfessorService(mockApi);
    const result = await service.execute(42);
    expect(mockApi.getAlunosByProfessor).toHaveBeenCalledWith(42);
    expect(result).toEqual({ alunos: ['Aluno1'], id: 42 });
  });
});
