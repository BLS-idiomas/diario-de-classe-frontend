import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class DeleteDiaAulaService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(id) {
    return await this.diaAulaApi.delete(id);
  }

  static async handle(id) {
    const diaAulaApi = new DiaAulaApi();
    const service = new DeleteDiaAulaService(diaAulaApi);

    return await service.execute(id);
  }
}
