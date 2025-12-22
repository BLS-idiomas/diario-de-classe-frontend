import { AulaApi } from '@/store/api/aulaApi';

export class CreateAulaService {
  constructor(aulaApi) {
    this.aulaApi = aulaApi;
  }

  async execute(data) {
    return await this.aulaApi.create(data);
  }

  static async handle(data) {
    const aulaApi = new AulaApi();
    const service = new CreateAulaService(aulaApi);

    return await service.execute(data);
  }
}
