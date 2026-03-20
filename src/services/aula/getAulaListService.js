import { AulaApi } from '@/store/api/aulaApi';

export class GetAulaListService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(params) {
    return await this.aulaApi.getAll(params);
  }

  static async handle(params) {
    const aulaApi = new AulaApi();
    const service = new GetAulaListService(aulaApi);

    return await service.execute(params);
  }
}
