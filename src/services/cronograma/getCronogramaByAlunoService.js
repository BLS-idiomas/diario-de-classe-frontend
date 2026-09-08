import { AlunoApi } from '@/store/api/alunoApi';

export class GetCronogramaByAlunoService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.getCronogramaByAluno(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new GetCronogramaByAlunoService(alunoApi);

    return await service.execute(id);
  }
}
