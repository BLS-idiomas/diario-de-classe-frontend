import { ContratoApi } from '@/store/api/contratoApi';

export class CreateManyAulasService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id, data) {
    return await this.contratoApi.createManyAulas(id, data);
  }

  static async handle(id, data) {
    const contratoApi = new ContratoApi();
    const service = new CreateManyAulasService(contratoApi);

    return await service.execute(id, data);
  }
}
