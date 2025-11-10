import { ProfessorApi } from '@/store/api/professorApi';

export class DeleteProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id) {
    return await this.professorApi.delete(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const service = new DeleteProfessorService(professorApi);

    return await service.execute(id);
  }
}
