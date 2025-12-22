import { AlunoApi } from '@/store/api/alunoApi';

export class GetAulasByAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getAulasByAluno(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetAulasByAlunoService(alunoApi);

    return await service.execute(id);
  }
}
