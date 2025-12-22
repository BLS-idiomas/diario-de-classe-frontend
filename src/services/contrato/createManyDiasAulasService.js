import { ContratoApi } from '@/store/api/contratoApi';

export class CreateManyDiasAulasService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id, data) {
    return await this.contratoApi.createManyDiasAulas(id, data);
  }

  static async handle(id, data) {
    const contratoApi = new ContratoApi();
    const service = new CreateManyDiasAulasService(contratoApi);

    return await service.execute(id, data);
  }
}
