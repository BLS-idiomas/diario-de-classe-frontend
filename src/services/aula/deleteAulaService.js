import { AulaApi } from '@/store/api/aulaApi';

export class DeleteAulaService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(id) {
    return await this.aulaApi.delete(id);
  }

  static async handle(id) {
    const aulaApi = new AulaApi();
    const service = new DeleteAulaService(aulaApi);

    return await service.execute(id);
  }
}
