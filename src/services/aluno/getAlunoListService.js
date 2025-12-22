import { AlunoApi } from '@/store/api/alunoApi';

export class GetAlunoListService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(searchParam) {
    return await this.alunoApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const alunoApi = new AlunoApi();
    const service = new GetAlunoListService(alunoApi);

    return await service.execute(searchParam);
  }
}
