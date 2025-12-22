import { AulaApi } from '@/store/api/aulaApi';

export class GetAulaByIdService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(id) {
    return await this.aulaApi.getById(id);
  }

  static async handle(id) {
    const aulaApi = new AulaApi();
    const service = new GetAulaByIdService(aulaApi);

    return await service.execute(id);
  }
}
