import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class CreateProfessorService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(data) {
    const response = await this.api.create(data);

    if (response?.data?.id) {
      response.data = new this.Model(response.data);
    }

    return response;
  }

  static async handle(data) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new CreateProfessorService(professorApi, professor);

    return await service.execute(data);
  }
}
