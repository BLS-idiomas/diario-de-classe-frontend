import { ContratoApi } from '@/store/api/contratoApi';

export class DeleteContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(id) {
    return await this.contratoApi.delete(id);
  }

  static async handle(id) {
    const contratoApi = new ContratoApi();
    const service = new DeleteContratoService(contratoApi);

    return await service.execute(id);
  }
}
