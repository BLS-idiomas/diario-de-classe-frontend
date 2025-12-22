import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class CreateGroupDiaAulaService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(data) {
    return await this.diaAulaApi.create(data);
  }

  static async handle(data) {
    const diaAulaApi = new DiaAulaApi();
    const service = new CreateGroupDiaAulaService(diaAulaApi);

    return await service.execute(data);
  }
}
