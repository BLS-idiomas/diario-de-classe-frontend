import { ProfessorApi } from './professorApi';

describe('ProfessorApi', () => {
  let api;
  beforeEach(() => {
    api = new ProfessorApi();
    api.get = jest.fn(async url => ({ url }));
    api.baseEndpoint = '/professores';
  });

  it('deve retornar o endpoint correto', () => {
    expect(api.getEndpoint()).toBe('/professores');
  });

  it('deve chamar getAulasByProfessor com o endpoint correto', async () => {
    const result = await api.getAulasByProfessor(123);
    expect(api.get).toHaveBeenCalledWith('/professores/123/aulas');
    expect(result.url).toBe('/professores/123/aulas');
  });

  it('deve chamar getAlunosByProfessor com o endpoint correto', async () => {
    const result = await api.getAlunosByProfessor(456);
    expect(api.get).toHaveBeenCalledWith('/professores/456/alunos');
    expect(result.url).toBe('/professores/456/alunos');
  });
});
