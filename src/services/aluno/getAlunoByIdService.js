import { AlunoApi } from '@/store/api/alunoApi';

export class GetAlunoByIdService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getById(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetAlunoByIdService(alunoApi);

    return await service.execute(id);
  }
}
