import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class CreateDiaAulaService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(data) {
    return await this.diaAulaApi.create(data);
  }

  static async handle(data) {
    const diaAulaApi = new DiaAulaApi();
    const service = new CreateDiaAulaService(diaAulaApi);

    return await service.execute(data);
  }
}
