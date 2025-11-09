import { ProfessorApi } from '@/store/api/professorApi';

export class UpdateProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id, data) {
    return await this.professorApi.update(id, data);
  }

  static async handle(id, data) {
    const professorApi = new ProfessorApi();
    const service = new UpdateProfessorService(professorApi);

    return await service.execute(id, data);
  }
}
