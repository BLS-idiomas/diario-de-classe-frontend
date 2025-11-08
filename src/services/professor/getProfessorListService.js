import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class GetProfessorListService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(searchParam) {
    const response = await this.api.getAll({ q: searchParam });

    response.data.data = response.data.data.map(
      professorData => new this.Model(professorData)
    );

    return response;
  }

  static async handle(searchParam) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new GetProfessorListService(professorApi, professor);

    return await service.execute(searchParam);
  }
}
