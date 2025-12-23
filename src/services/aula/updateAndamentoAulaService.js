import { AulaApi } from '@/store/api/aulaApi';

export class UpdateAndamentoAulaService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(id, data) {
    return await this.aulaApi.updateAndamento(id, data);
  }

  static async handle(id, data) {
    const aulaApi = new AulaApi();
    const service = new UpdateAndamentoAulaService(aulaApi);

    return await service.execute(id, data);
  }
}
