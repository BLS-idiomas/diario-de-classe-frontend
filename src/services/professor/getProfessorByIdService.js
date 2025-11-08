import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class GetProfessorByIdService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(id) {
    const response = await this.api.getById(id);

    if (response.data) {
      response.data = new this.Model(response.data);
    }

    return response;
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new GetProfessorByIdService(professorApi, professor);

    return await service.execute(id);
  }
}
