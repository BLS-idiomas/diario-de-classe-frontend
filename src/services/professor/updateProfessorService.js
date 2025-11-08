import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class UpdateProfessorService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(id, data) {
    const response = await this.api.update(id, data);

    if (response?.data?.id) {
      response.data = new this.Model(response.data);
    }

    return response;
  }

  static async handle(id, data) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new UpdateProfessorService(professorApi, professor);

    return await service.execute(id, data);
  }
}
