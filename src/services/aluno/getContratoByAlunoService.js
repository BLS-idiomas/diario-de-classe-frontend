import { AlunoApi } from '@/store/api/alunoApi';

export class GetContratoByAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getContratoByAluno(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetContratoByAlunoService(alunoApi);

    return await service.execute(id);
  }
}
