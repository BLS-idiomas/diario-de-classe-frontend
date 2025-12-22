import { AulaApi } from '@/store/api/aulaApi';

export class UpdateAulaService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(id, data) {
    return await this.aulaApi.update(id, data);
  }

  static async handle(id, data) {
    const aulaApi = new AulaApi();
    const service = new UpdateAulaService(aulaApi);

    return await service.execute(id, data);
  }
}
