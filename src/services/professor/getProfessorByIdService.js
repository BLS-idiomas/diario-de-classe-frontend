import { ProfessorApi } from '@/store/api/professorApi';

export class GetProfessorByIdService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id) {
    return await this.professorApi.getById(id);
  }

  static async handle(id) {
    const professorApi = new ProfessorApi();
    const service = new GetProfessorByIdService(professorApi);

    return await service.execute(id);
  }
}
