import { AlunoApi } from '@/store/api/alunoApi';

export class DownloadCronogramaExcelService {
  constructor(alunoApi) {
    this.alunoApi = alunoApi;
  }

  async execute(id) {
    return await this.alunoApi.downloadCronogramaExcel(id);
  }

  static async handle(id) {
    const alunoApi = new AlunoApi();
    const service = new DownloadCronogramaExcelService(alunoApi);

    return await service.execute(id);
  }
}
