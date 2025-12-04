import { AlunoApi } from '@/store/api/alunoApi';

export class CreateAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(data) {
    return await this.alunoApi.create(data);
  }

  static async handle(data) {
    const alunoApi = new AlunoApi();
    const service = new CreateAlunoService(alunoApi);

    return await service.execute(data);
  }
}
