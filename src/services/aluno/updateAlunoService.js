import { AlunoApi } from '@/store/api/alunoApi';

export class UpdateAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id, data) {
    return await this.alunoApi.update(id, data);
  }

  static async handle(id, data) {
    const alunoApi = new AlunoApi();
    const service = new UpdateAlunoService(alunoApi);

    return await service.execute(id, data);
  }
}
