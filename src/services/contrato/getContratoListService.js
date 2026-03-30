import { ContratoApi } from '@/store/api/contratoApi';

export class GetContratoListService {
  constructor(contratoApi) {
    this.contratoApi = contratoApi;
  }

  async execute(params) {
    return await this.contratoApi.getAll(params);
  }

  static async handle(params) {
    const contratoApi = new ContratoApi();
    const service = new GetContratoListService(contratoApi);

    return await service.execute(params);
  }
}
