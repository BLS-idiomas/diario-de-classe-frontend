import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class UpdateDiaAulaService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(id, data) {
    return await this.diaAulaApi.update(id, data);
  }

  static async handle(id, data) {
    const diaAulaApi = new DiaAulaApi();
    const service = new UpdateDiaAulaService(diaAulaApi);

    return await service.execute(id, data);
  }
}
