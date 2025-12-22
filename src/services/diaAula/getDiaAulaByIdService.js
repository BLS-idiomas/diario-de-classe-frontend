import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class GetDiaAulaByIdService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(id) {
    return await this.diaAulaApi.getById(id);
  }

  static async handle(id) {
    const diaAulaApi = new DiaAulaApi();
    const service = new GetDiaAulaByIdService(diaAulaApi);

    return await service.execute(id);
  }
}
