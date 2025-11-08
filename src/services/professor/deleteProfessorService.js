import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class DeleteProfessorService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(id) {
    return await this.api.delete(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new DeleteProfessorService(professorApi, professor);

    return await service.execute(id);
  }
}
