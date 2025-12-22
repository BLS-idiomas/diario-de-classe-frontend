import { AlunoApi } from '@/store/api/alunoApi';

export class GetContratosByAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getContratosByAluno(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetContratosByAlunoService(alunoApi);

    return await service.execute(id);
  }
}
