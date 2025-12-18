import { ContratoApi } from '@/store/api/contratoApi';

export class GenerateAulasService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id, data) {
    return await this.contratoApi.generateAulas(id, data);
  }

  static async handle(id, data) {
    const contratoApi = new ContratoApi();
    const service = new GenerateAulasService(contratoApi);

    return await service.execute(id, data);
  }
}
