import { ProfessorApi } from './professorApi';

describe('ProfessorApi', () => {
  let api;

  beforeEach(() => {
    api = new ProfessorApi();
  });

  it('should set baseEndpoint to /professores', () => {
    expect(api.baseEndpoint).toBe('/professores');
  });

  it('should call getAulasByProfessor with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getAulasByProfessor(1);
    expect(api.get).toHaveBeenCalledWith('/professores/1/aulas');
  });

  it('should call getAlunosByProfessor with correct endpoint', async () => {
    api.get = jest.fn();
    await api.getAlunosByProfessor(2);
    expect(api.get).toHaveBeenCalledWith('/professores/2/alunos');
  });

  it('should call updateDisponibilidade with correct endpoint and data', async () => {
    api.put = jest.fn();
    const data = { disponivel: true };
    await api.updateDisponibilidade(3, data);
    expect(api.put).toHaveBeenCalledWith(
      '/professores/3/disponibilidade',
      data
    );
  });
});
