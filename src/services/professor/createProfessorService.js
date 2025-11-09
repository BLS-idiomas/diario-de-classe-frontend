import { ProfessorApi } from '@/store/api/professorApi';

export class CreateProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(data) {
    return await this.professorApi.create(data);
  }

  static async handle(data) {
    const professorApi = new ProfessorApi();
    const service = new CreateProfessorService(professorApi);

    return await service.execute(data);
  }
}
