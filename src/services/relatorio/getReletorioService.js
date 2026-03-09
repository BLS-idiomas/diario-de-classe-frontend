import { RelatorioApi } from '@/store/api/relatorioApi';

export class GetRelatorioService {
  constructor(relatorioApi) {
    this.relatorioApi = relatorioApi;
  }

  async execute() {
    return await this.relatorioApi.getAll();
  }

  static async handle() {
    const relatorioApi = new RelatorioApi();
    const service = new GetRelatorioService(relatorioApi);

    return await service.execute();
  }
}
