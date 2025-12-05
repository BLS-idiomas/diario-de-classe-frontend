import { AlunoApi } from '@/store/api/alunoApi';

export class DeleteAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.delete(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new DeleteAlunoService(alunoApi);

    return await service.execute(id);
  }
}
