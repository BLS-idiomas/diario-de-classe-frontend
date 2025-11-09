import { Professor } from '@/models/Professor';
import { ProfessorApi } from '@/store/api/professorApi';

export class UpdateProfessorService {
  constructor(entityApi, entityModel) {
    this.api = entityApi;
    this.Model = entityModel;
  }

  async execute(id, data) {
    return await this.api.update(id, data);
  }

  static async handle(id, data) {
    const professorApi = new ProfessorApi();
    const professor = Professor;
    const service = new UpdateProfessorService(professorApi, professor);

    return await service.execute(id, data);
  }
}
