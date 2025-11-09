import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class CreateProfessorService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(data) {
    return await this.api.create(data);
  }

  static async handle(data) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new CreateProfessorService(professorApi, professor);

    return await service.execute(data);
  }
}
