import { ProfessorApi } from '@/store/api/professorApi';

export class GetAlunosByProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id) {
    return await this.professorApi.getAlunosByProfessor(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const service = new GetAlunosByProfessorService(professorApi);

    return await service.execute(id);
  }
}
