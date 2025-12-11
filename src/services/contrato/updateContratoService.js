import { ContratoApi } from '@/store/api/contratoApi';

export class UpdateContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id, data) {
    return await this.contratoApi.update(id, data);
  }

  static async handle(id, data) {
    const contratoApi = new ContratoApi();
    const service = new UpdateContratoService(contratoApi);

    return await service.execute(id, data);
  }
}
