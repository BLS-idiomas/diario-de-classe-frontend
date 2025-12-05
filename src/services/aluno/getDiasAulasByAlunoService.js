import { AlunoApi } from '@/store/api/alunoApi';

export class GetDiasAulasByAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getDiasAulasByAluno(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetDiasAulasByAlunoService(alunoApi);

    return await service.execute(id);
  }
}
