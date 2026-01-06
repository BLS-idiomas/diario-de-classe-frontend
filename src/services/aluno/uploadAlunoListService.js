import { AlunoApi } from '@/store/api/alunoApi';

export class UploadAlunoListService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(file) {
    return await this.alunoApi.uploadAlunoList(file);
  }

  static async handle(file) {
    const alunoApi = new AlunoApi();
    const service = new UploadAlunoListService(alunoApi);

    return await service.execute(file);
  }
}
