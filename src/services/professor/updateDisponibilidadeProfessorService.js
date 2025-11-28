import { ProfessorApi } from '@/store/api/professorApi';

export class UpdateDisponibilidadeProfessorService {
  constructor(professorApi) {
    this.professorApi = professorApi;
  }

  async execute(id, data) {
    return await this.professorApi.updateDisponibilidade(id, data);
  }

  static async handle(id, data) {
    const professorApi = new ProfessorApi();
    const service = new UpdateDisponibilidadeProfessorService(professorApi);

    return await service.execute(id, data);
  }
}
