import { AlunoApi } from '@/store/api/alunoApi';

export class CreateCronogramaService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(idAluno, data) {
    return await this.alunoApi.createCronogramaByAluno(idAluno, data);
  }

  static async handle(idAluno, data) {
    const alunoApi = new AlunoApi();
    const service = new CreateCronogramaService(alunoApi);

    return await service.execute(idAluno, data);
  }
}
