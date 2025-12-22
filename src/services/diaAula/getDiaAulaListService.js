import { DiaAulaApi } from '@/store/api/diaAulaApi';

export class GetDiaAulaListService {
  constructor(diaAulaApi) {
    this.diaAulaApi = diaAulaApi;
  }

  async execute(searchParam) {
    return await this.diaAulaApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const diaAulaApi = new DiaAulaApi();
    const service = new GetDiaAulaListService(diaAulaApi);

    return await service.execute(searchParam);
  }
}
