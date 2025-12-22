import { ContratoApi } from '@/store/api/contratoApi';

export class CreateContratoService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(data) {
    return await this.contratoApi.create(data);
  }

  static async handle(data) {
    const contratoApi = new ContratoApi();
    const service = new CreateContratoService(contratoApi);

    return await service.execute(data);
  }
}
