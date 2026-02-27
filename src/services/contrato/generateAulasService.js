import { ContratoApi } from '@/store/api/contratoApi';

export class GenerateAulasService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(data) {
    return await this.contratoApi.generateAulas(data);
  }

  static async handle({ data }) {
    const contratoApi = new ContratoApi();
    const service = new GenerateAulasService(contratoApi);

    return await service.execute(data);
  }
}
