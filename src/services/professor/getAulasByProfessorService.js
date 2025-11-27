import { ProfessorApi } from '@/store/api/professorApi';

export class GetAulasByProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id) {
    return await this.professorApi.getAulasByProfessor(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const service = new GetAulasByProfessorService(professorApi);

    return await service.execute(id);
  }
}
