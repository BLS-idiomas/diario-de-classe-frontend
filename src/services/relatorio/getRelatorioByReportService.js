import { RelatorioApi } from '@/store/api/relatorioApi';

export class GetRelatorioByReportService {
  constructor(relatorioApi) {
    this.relatorioApi = relatorioApi;
  }

  async execute(report, params) {
    return await this.relatorioApi.getByReport(report, params);
  }

  static async handle(report, params = {}) {
    const relatorioApi = new RelatorioApi();
    const service = new GetRelatorioByReportService(relatorioApi);

    return await service.execute(report, params);
  }
}
