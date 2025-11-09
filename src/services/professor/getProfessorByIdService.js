import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class GetProfessorByIdService {
  constructor(entityApi, entityModel) {
    this.professorApi = entityApi;
    this.Professor = entityModel;
  }

  async execute(id) {
    return await this.professorApi.getById(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new GetProfessorByIdService(professorApi, professor);

    return await service.execute(id);
  }
}
