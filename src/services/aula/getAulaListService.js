import { AulaApi } from '@/store/api/aulaApi';

export class GetAulaListService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(searchParam) {
    return await this.aulaApi.getAll({ q: searchParam });
  }

  static async handle(searchParam) {
    const aulaApi = new AulaApi();
    const service = new GetAulaListService(aulaApi);

    return await service.execute(searchParam);
  }
}
