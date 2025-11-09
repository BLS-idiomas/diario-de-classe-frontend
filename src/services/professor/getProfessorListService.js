import { ProfessorApi } from '@/store/api/professorApi';

export class GetProfessorListService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(searchParam) {
    return await this.professorApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const professorApi = new ProfessorApi();
    const service = new GetProfessorListService(professorApi);

    return await service.execute(searchParam);
  }
}
